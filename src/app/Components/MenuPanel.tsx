import Link from 'next/link';

interface MenuPanelProps {
  onHideMenuPanel?: () => void;
}

const menuItems = [
  { title: "Recipe manage", subtitle: "create, update or delete recipies" },
  { title: "Recipe Challenges", subtitle: "participate and win" },
  { title: "Live Stream", subtitle: "enjoy with live recipies" },
  { title: "Filter Recipies", subtitle: "new holiday recipies" },
  { title: "Community Forum", subtitle: "share your ideas" },
];

const MenuPanel = ({ onHideMenuPanel }: MenuPanelProps) => {
  return (
    <div className="bg-yellow-100 w-60 p-4 rounded-tr-3xl rounded-br-3xl shadow-md">
      {menuItems.map(({ title, subtitle }, i) =>
        i === 0 ? (
          <Link
            key={i}
            href="/Pages/RecipeManagement/ManageRecipe/ManageRecipe"
            className="mb-6 font-bold block hover:bg-yellow-300 cursor-pointer rounded p-2"
            onClick={() => {
              if (onHideMenuPanel) {
                onHideMenuPanel();
              }
            }}
          >
            <div>{title}</div>
            <div className="text-xs text-gray-500">{subtitle}</div>
          </Link>
        ) : (
          <div key={i} className="mb-6 font-medium">
            <div>{title}</div>
            <div className="text-xs text-gray-500">{subtitle}</div>
          </div>
        )
      )}
    </div>
  );
};

export default MenuPanel;
