import SearchInput from "./SearchInput";

const Home = () => {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white px-4">
        <h1 className="text-4xl uppercase tracking-widest text-gray-500">Reddit Lite</h1>
        <h4 className="tracking-widest text-gray-500">Lightweight Reddit Browsing</h4>
        <SearchInput />
      </div>
    );
  };
  
  export default Home;
  