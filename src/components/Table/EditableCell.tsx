import React, { useState, useEffect } from "react";
import { Cell } from "@tanstack/react-table";

interface EditableCellProps {
  cell: Cell<any, unknown>;
  row: any;
  column: any;
  onUpdate: (rowId: string, columnId: string, value: string) => void;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  cell,
  row,
  column,
  onUpdate,
}) => {
  const [value, setValue] = useState(cell.getValue() as string);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setValue(cell.getValue() as string);
  }, [cell.getValue()]);

  const onBlur = () => {
    setIsEditing(false);
    if (value !== cell.getValue()) {
      onUpdate(row.id, column.id, value);
    }
  };

  if (isEditing) {
    return (
      <input
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        autoFocus
      />
    );
  }

  return (
    <div
      className="p-2 cursor-pointer hover:bg-gray-50"
      onClick={() => setIsEditing(true)}
    >
      {value}
    </div>
  );
};
