import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface SearchBarProps {
  value: string;
  setValue: (value: string) => void;
  onSubmit: () => void;
}

export const SearchBar = ({ value, setValue, onSubmit }: SearchBarProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <input
        className="rounded-lg px-4 py-1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for books"
        onKeyDown={(e) => e.key === "Enter" && value !== "" && onSubmit()}
      ></input>
      <button className="rounded-lg bg-zinc-50 p-2" onClick={onSubmit} disabled={!value}>
        <MagnifyingGlassIcon className="" />
      </button>
    </div>
  );
};
