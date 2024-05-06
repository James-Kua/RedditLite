const Home = () => {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white px-4">
        <h1 className="text-4xl uppercase tracking-widest text-gray-500">Reddit Lite</h1>
        <h4 className="tracking-widest text-gray-500">Lightweight Reddit Browsing</h4>
        <p className="mt-4 text-gray-600 text-center">
          To start browsing, enter the subreddit in the URL path like this: 
          <code className="bg-gray-200 px-2 py-1 rounded">/{'{subreddit}'}</code>
        </p>
      </div>
    );
  };
  
  export default Home;
  