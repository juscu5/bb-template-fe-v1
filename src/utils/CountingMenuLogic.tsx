import React, { useState, useEffect } from "react";

interface MenuCount {
  [key: string]: number;
}

const UserAccessDialog: React.FC = () => {
  const [array, setArray] = useState([
    "01",
    "01-01",
    "01-02",
    "02",
    "02-01",
    "02-02",
    "01-01-01",
    "02-01-01",
    "02-01-02",
    "02-02-01",
    "02-02-02",
    "02-02-03",
    "02-03",
  ]);

  // Function to count submenus (excluding supersubmenus) for each menu
  const countSubmenus = (menu: string): number => {
    return array.filter((item) => {
      // Check if the item starts with the menu code followed by a dash
      if (item.startsWith(menu + "-") && item !== menu) {
        // Check if it does not have another dash after the first dash (not a supersubmenu)
        return !item.slice(menu.length + 1).includes("-");
      }
      return false;
    }).length;
  };

  // Function to count supersubmenus for each submenu
  const countSupersubmenus = (submenu: string): number => {
    return array.filter(
      (item) => item.startsWith(submenu + "-") && item !== submenu
    ).length;
  };

  // Rendering menu, submenu, and supersubmenu counts
  return (
    <div>
      <h2>Menu and Submenu Counts:</h2>
      {array
        .filter((item) => !item.includes("-"))
        .map((menu) => (
          <div key={menu}>
            {menu} has {countSubmenus(menu)} Submenu(s)
          </div>
        ))}

      <h2>Submenu and Supersubmenu Counts:</h2>
      {array
        .filter((item) => item.includes("-") && !item.endsWith("-"))
        .map((submenu) => (
          <div key={submenu}>
            {submenu} has {countSupersubmenus(submenu)} Supersubmenu(s)
          </div>
        ))}
    </div>
  );
};

export default UserAccessDialog;

// const subMenu = data.items?.map((submenu: any, idxsub: number) => {
//   const superSubMenu = submenu.items?.map(
//     (superSubMenu: any, idxssub: any) => {
//       return (
//         <>
//           <Box
//             sx={{ display: "flex", flexDirection: "row", ml: 3 }}
//             key={idxsub}
//           >
//             <FormControlLabel
//               label={superSubMenu.label}
//               control={
//                 <Checkbox
//                   checked={
//                     !!checkedSubmenu2.find(
//                       (submenu2: any) =>
//                         submenu2.mengrp === submenu.mensub &&
//                         submenu2.checked
//                     )
//                   }
//                   // onChange={(event) =>
//                   //   handleChangeSubMenu(event, idx, idxsub)
//                   // }
//                 />
//               }
//             />
//           </Box>
//         </>
//       );
//     }
//   );
//   return (
//     <Box
//       sx={{ display: "flex", flexDirection: "column", ml: 3 }}
//       key={idxsub}
//     >
//       <FormControlLabel
//         label={submenu.label}
//         control={
//           <Checkbox
//             // checked={
//             //   !!checkedSubmenu1.find(
//             //     (submenu1: any) =>
//             //       submenu1.menidx === data.menidx && submenu1.checked
//             //   )
//             // }
//             checked={checkedSubmenu1[idxsub]?.checked || false}
//             onChange={(event) =>
//               handleSubmenu1(
//                 event,
//                 submenu.mengrp,
//                 submenu.mensub,
//                 idxsub
//               )
//             }
//           />
//         }
//       />
//       {superSubMenu}
//     </Box>
//   );
// });
