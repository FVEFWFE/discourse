"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export type IntelReport = {
  id: string
  time: string
  venue: string
  district: string
  playerScore: number
  pricePaid: string
  service: string
  tags: string[]
  isBlurred?: boolean
}

export const columns: ColumnDef<IntelReport>[] = [
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "venue",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Venue
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const isBlurred = row.original.isBlurred;
      const venue = row.getValue("venue") as string;
      return isBlurred ? (
        <span className="blur-sm select-none">{venue}</span>
      ) : (
        <span>{venue}</span>
      );
    },
  },
  {
    accessorKey: "district",
    header: "District",
  },
  {
    accessorKey: "playerScore",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Player Score™
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const score = Number.parseFloat(row.getValue("playerScore"))
      const variant = score >= 8.5 ? "default" : score >= 7 ? "secondary" : "destructive"
      const bgColor = score >= 8.5 ? "bg-green-500 hover:bg-green-600" : ""

      return (
        <Badge variant={variant} className={bgColor}>
          {score}
        </Badge>
      )
    },
  },
  {
    accessorKey: "pricePaid",
    header: "Price Paid",
  },
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[]
      return (
        <div className="flex gap-1 flex-wrap">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <Button variant="ghost" size="sm">
          View Dossier
        </Button>
      )
    },
  },
]
