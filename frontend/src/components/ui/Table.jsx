const Table = ({ columns, children }) => {
  return (
    <div className="overflow-x-auto scrollbar-thin -mx-1">
      <table className="min-w-full divide-y divide-gray-100">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="text-left px-3 py-2 text-xs font-bold uppercase tracking-wide text-navy-800"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
