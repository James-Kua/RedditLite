import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Feed from "./components/Feed";
import Error from "./components/Error";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:subreddit" element={<FeedWrapper />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;

import { useParams } from "react-router-dom";

const FeedWrapper = () => {
  const { subreddit } = useParams();

  return <Feed subreddit={subreddit || "nus"} />;
};
