import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface SearchBarProps {
  value: string;
}

const search = async (formData: FormData) => {
  "use server";
  redirect(`/?search=${formData.get("search")}`);
};

export const SearchBar = ({ value }: SearchBarProps) => {
  return (
    <form className="flex flex-row items-center gap-2" action={search}>
      <input
        defaultValue={value}
        className="rounded-lg px-4 py-1"
        placeholder="Search for books"
        name="search"
      ></input>
      <button className="rounded-lg bg-zinc-50 p-2" type="submit">
        <MagnifyingGlassIcon className="" />
      </button>
    </form>
  );
};
