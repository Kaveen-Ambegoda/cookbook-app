// app/Home/Welcome/page.tsx

const Welcome = () => {
    return (
      <div className="mb-8 mt-4 relative bg-[url('/image/bg.png')] bg-cover bg-no-repeat">
        <section className="text-center py-24 px-6">
          <h1 className="text-4xl font-bold">
            <span className="text-orange-600">WELCOME TO OUR </span>
            <span className="text-green-700">COOKBOOK</span>          
          </h1>
          
          <h2 className="mt-8 text-3xl font-extrabold text-black">
            Recipes, Tips, and More!
          </h2>
          <p className="mt-8  mx-auto max-w-xl text-base text-gray-800 font-semibold">
            Your kitchen companion has arrived! Discover, cook, and savor recipes
            that will bring joy and flavor to your table.
          </p>
        </section>
  
        {/* This is right sight image */}
        <img
          src="/image/topbg.png"
          alt="Top bg"
          className="absolute top-0 right-0 w-32"
        />
        
      </div>
    );
  };
  
  export default Welcome;
  