const menuItems = [
    { title: "Recipe manage", subtitle: "create, update or delete recipies" },
    { title: "Recipe Challenges", subtitle: "participate and win" },
    { title: "Live Stream", subtitle: "enjoy with live recipies" },
    { title: "Filter Recipies", subtitle: "new holiday recipies" },
    { title: "Community Forum", subtitle: "share your ideas" },
  ]
  
  const MenuPanel = () => {
    return (
      <div className="bg-yellow-100 w-60 p-4 rounded-tr-3xl rounded-br-3xl shadow-md">
        {menuItems.map(({ title, subtitle }, i) => (
          <div key={i} className={`mb-6 ${i === 0 ? "font-bold" : "font-medium"}`}>
            <div>{title}</div>
            <div className="text-sm text-gray-500">{subtitle}</div>
          </div>
        ))}
      </div>
    )
  }
  
  export default MenuPanel
  