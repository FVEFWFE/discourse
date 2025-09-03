import { Actor } from 'apify';
import { PlaywrightCrawler } from 'apify';
import natural from 'natural';

await Actor.init();

const input = await Actor.getInput();
const {
    startUrls = [
        { url: 'https://www.internationalsexguide.nl/forum/forumdisplay.php?f=192' }, // Pattaya forum
        { url: 'https://www.internationalsexguide.nl/forum/forumdisplay.php?f=191' }, // Bangkok forum
    ],
    maxPagesPerForum = 50,
} = input;

// Keywords to look for
const keywords = {
    gfe: /\bgfe\b/i,
    starfish: /\bstarfish\b/i,
    bbfs: /\bbbfs\b/i,
    bareback: /\bbareback\b/i,
    st: /\bst\b|\bshort\s*time\b/i,
    lt: /\blt\b|\blong\s*time\b/i,
};

// Price patterns
const pricePatterns = [
    /(\d+)\s*(?:thb|baht|฿)/i,
    /(?:thb|baht|฿)\s*(\d+)/i,
    /(\d+)\s*(?:for|charge|cost|price|pay|paid).*?(?:st|short\s*time|lt|long\s*time)/i,
];

// Venue name extraction using NER-like patterns
const venuePatterns = [
    /(?:at|in|from|venue:|bar:|club:|gc:|hotel:)\s*([A-Z][A-Za-z0-9\s\-'&]{2,30})/g,
    /([A-Z][A-Za-z0-9\s\-'&]{2,30})\s*(?:bar|club|gogo|gc|massage|hotel)/gi,
];

const crawler = new PlaywrightCrawler({
    maxRequestsPerCrawl: 1000,
    requestHandlerTimeoutSecs: 300,

    async requestHandler({ page, request, enqueueLinks }) {
        console.log(`Processing: ${request.url}`);

        // If this is a forum listing page, enqueue thread links
        if (request.url.includes('forumdisplay.php')) {
            await enqueueLinks({
                selector: 'a.title',
                transformRequestFunction: (req) => {
                    // Only process threads, not other forum pages
                    if (req.url.includes('showthread.php')) {
                        return req;
                    }
                    return null;
                },
            });

            // Enqueue next page
            const currentPage = parseInt(new URL(request.url).searchParams.get('page') || '1');
            if (currentPage < maxPagesPerForum) {
                const nextPageUrl = request.url.includes('page=') 
                    ? request.url.replace(/page=\d+/, `page=${currentPage + 1}`)
                    : request.url + `&page=${currentPage + 1}`;
                await enqueueLinks({
                    urls: [nextPageUrl],
                });
            }

            return;
        }

        // Process individual thread pages
        if (request.url.includes('showthread.php')) {
            const posts = await page.$$eval('.postcontainer', (elements) => {
                return elements.map(el => {
                    const username = el.querySelector('.username')?.textContent?.trim() || '';
                    const postDate = el.querySelector('.postdate .date')?.textContent?.trim() || '';
                    const postContent = el.querySelector('.postcontent')?.textContent?.trim() || '';
                    
                    return {
                        username,
                        postDate,
                        postContent,
                    };
                });
            });

            // Process each post
            for (const post of posts) {
                if (!post.postContent) continue;

                // Extract venue names
                const venueNames = [];
                for (const pattern of venuePatterns) {
                    const matches = post.postContent.matchAll(pattern);
                    for (const match of matches) {
                        const venueName = match[1]?.trim();
                        if (venueName && venueName.length > 2) {
                            venueNames.push(venueName);
                        }
                    }
                }

                // Extract prices
                const pricesMentioned = [];
                for (const pattern of pricePatterns) {
                    const matches = post.postContent.matchAll(pattern);
                    for (const match of matches) {
                        const price = parseInt(match[1]);
                        if (price && price > 100 && price < 50000) {
                            pricesMentioned.push(price);
                        }
                    }
                }

                // Count keywords
                const keywordCounts = {};
                for (const [key, pattern] of Object.entries(keywords)) {
                    const matches = post.postContent.match(pattern);
                    keywordCounts[key] = matches ? matches.length : 0;
                }

                // Store the processed data
                await Actor.pushData({
                    postContent: post.postContent,
                    username: post.username,
                    postDate: post.postDate,
                    venueNames: [...new Set(venueNames)], // Remove duplicates
                    pricesMentioned: [...new Set(pricesMentioned)],
                    keywords: keywordCounts,
                    sourceUrl: request.url,
                    scrapedAt: new Date().toISOString(),
                });
            }

            // Enqueue pagination links within thread
            await enqueueLinks({
                selector: '.pagination a',
                transformRequestFunction: (req) => {
                    if (req.url.includes('showthread.php')) {
                        return req;
                    }
                    return null;
                },
            });
        }
    },

    failedRequestHandler({ request, error }) {
        console.error(`Request ${request.url} failed: ${error.message}`);
    },
});

await crawler.run(startUrls);

await Actor.exit();