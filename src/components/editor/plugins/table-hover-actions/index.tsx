import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { $getNearestNodeFromDOMNode, $getNodeByKey } from "lexical";
import {
  $deleteTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $insertTableColumnAtSelection,
  $insertTableRowAtSelection,
  $isTableCellNode,
  $isTableNode,
  $isTableRowNode,
  TableNode,
} from "@lexical/table";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function TableHoverActionsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [hoveredTable, setHoveredTable] = useState<{
    node: TableNode;
    dom: HTMLElement;
  } | null>(null);
  const actionButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      const table = target.closest("table");

      if (table) {
        editor.update(() => {
          const tableNode = $getNearestNodeFromDOMNode(table);
          if (tableNode && $isTableNode(tableNode)) {
            setHoveredTable({ node: tableNode, dom: table });
          } else {
            setHoveredTable(null);
          }
        });
      } else {
        setHoveredTable(null);
      }
    };

    const editorRoot = editor.getRootElement();
    editorRoot?.addEventListener("pointermove", handlePointerMove);

    return () => {
      editorRoot?.removeEventListener("pointermove", handlePointerMove);
    };
  }, [editor]);

  useEffect(() => {
    if (hoveredTable && actionButtonRef.current) {
      const { dom } = hoveredTable;
      const rect = dom.getBoundingClientRect();
      const actionButton = actionButtonRef.current;
      actionButton.style.top = `${rect.top + window.scrollY - 20}px`;
      actionButton.style.left = `${rect.right + window.scrollX - 20}px`;
    }
  }, [hoveredTable]);

  const modifyTable = (action: string) => {
    if (hoveredTable) {
      editor.update(() => {
        const tableNode = $getNodeByKey(hoveredTable.node.getKey());
        if (!$isTableNode(tableNode)) return;

        const firstRow = tableNode.getFirstChild();
        const lastRow = tableNode.getLastChild();

        switch (action) {
          case "delete-table":
            tableNode.remove();
            break;
          case "add-row-start":
            if ($isTableRowNode(firstRow)) {
              const firstCell = firstRow.getFirstChild();
              if ($isTableCellNode(firstCell)) firstCell.selectStart();
            }
            $insertTableRowAtSelection(true);
            break;
          case "add-row-end":
            if ($isTableRowNode(lastRow)) {
              const lastCell = lastRow.getLastChild();
              if ($isTableCellNode(lastCell)) lastCell.selectEnd();
            }
            $insertTableRowAtSelection(false);
            break;
          case "delete-row-start":
            if ($isTableRowNode(firstRow)) {
              const firstCell = firstRow.getFirstChild();
              if ($isTableCellNode(firstCell)) firstCell.select();
              $deleteTableRowAtSelection();
            }
            break;
          case "delete-row-end":
            if ($isTableRowNode(lastRow)) {
              const lastCell = lastRow.getLastChild();
              if ($isTableCellNode(lastCell)) lastCell.select();
              $deleteTableRowAtSelection();
            }
            break;
          case "add-col-start":
            if ($isTableRowNode(firstRow)) {
              const firstCell = firstRow.getFirstChild();
              if ($isTableCellNode(firstCell)) firstCell.selectStart();
            }
            $insertTableColumnAtSelection(true);
            break;
          case "add-col-end":
            if ($isTableRowNode(lastRow)) {
              const lastCell = lastRow.getLastChild();
              if ($isTableCellNode(lastCell)) lastCell.selectEnd();
            }
            $insertTableColumnAtSelection(false);
            break;
          case "delete-col-start":
            if ($isTableRowNode(firstRow)) {
              const firstCell = firstRow.getFirstChild();
              if ($isTableCellNode(firstCell)) firstCell.select();
              $deleteTableColumnAtSelection();
            }
            break;
          case "delete-col-end":
            if ($isTableRowNode(lastRow)) {
              const lastCell = lastRow.getLastChild();
              if ($isTableCellNode(lastCell)) lastCell.select();
              $deleteTableColumnAtSelection();
            }
            break;
        }
      });
    }
  };

  if (!hoveredTable) {
    return null;
  }

  return createPortal(
    <div ref={actionButtonRef} style={{ position: "absolute", zIndex: 100 }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => modifyTable("delete-table")}>
            Delete Table
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => modifyTable("add-row-start")}>
            Add Row Above
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => modifyTable("add-row-end")}>
            Add Row Below
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => modifyTable("delete-row-start")}>
            Delete First Row
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => modifyTable("delete-row-end")}>
            Delete Last Row
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => modifyTable("add-col-start")}>
            Add Column Before
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => modifyTable("add-col-end")}>
            Add Column After
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => modifyTable("delete-col-start")}>
            Delete First Column
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => modifyTable("delete-col-end")}>
            Delete Last Column
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>,
    document.body
  );
}
