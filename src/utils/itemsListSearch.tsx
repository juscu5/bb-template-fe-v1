import { use_FetchRoutes } from "@/components/hooks/itemList";

const itemsListSearch = () => {
  const { data } = use_FetchRoutes();

  const authMenu = ({ searchItems }: { searchItems: string }) => {
    const hasData = data?.some(
      (menu: any) =>
        menu.menprg === searchItems ||
        menu?.items?.some(
          (submenu1: any) =>
            submenu1.menprg === searchItems ||
            submenu1?.items?.some(
              (submenu2: any) => submenu2.menprg === searchItems
            )
        )
    );

    return hasData;
  };

  return {
    authMenu,
  };
};

export default itemsListSearch;
