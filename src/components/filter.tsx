import { Button } from "@/components/ui/button";

export type FilterType = "all" | "inProgress" | "done";

type FilterProps = {
  currentFilter: FilterType;
  setCurrentFilter: React.Dispatch<React.SetStateAction<FilterType>>;
};

/* 
Clicado: currentStatusFilterChecked
Não clicado: currentStatusFilterUnchecked
*/

const Filter = ({ currentFilter, setCurrentFilter }: FilterProps) => {
  return (
    <div className="flex items-center justify-between mx-4 gap-2">
      <Button
        className="rounded-full cursor-pointer"
        variant={`${
          currentFilter === "all"
            ? "currentStatusFilterChecked"
            : "currentStatusFilterUnchecked"
        }`}
        onClick={() => setCurrentFilter("all")}
      >
        Todos
      </Button>
      <Button
        className="rounded-full cursor-pointer border-green-700"
        variant={`${
          currentFilter === "inProgress"
            ? "currentStatusFilterChecked"
            : "currentStatusFilterUnchecked"
        }`}
        onClick={() => setCurrentFilter("inProgress")}
      >
        Em andamento
      </Button>
      <Button
        className="rounded-full cursor-pointer"
        variant={`${
          currentFilter === "done"
            ? "currentStatusFilterChecked"
            : "currentStatusFilterUnchecked"
        }`}
        onClick={() => setCurrentFilter("done")}
      >
        Finalizado
      </Button>
    </div>
  );
};

export default Filter;
