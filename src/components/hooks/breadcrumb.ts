import { useLocation } from "react-router-dom"


export const useBreadcrumbLink = () => {

    let pathname = "";
    const breadcrumbs: any[] = [];
    const location = useLocation();

    const separatedLocation = location.pathname.split('/'); 
    const separatedLocationMapped = separatedLocation.slice(1);

    separatedLocationMapped.forEach((d: any, index: number) => {
        pathname+=`/${d}`;
        breadcrumbs.push({
            key: index,
            color: 'inherit',
            href: pathname,
            title: d
        });
    });
    
    return {breadcrumbs}
} 
