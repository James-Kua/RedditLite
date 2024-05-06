import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Feed from "./components/Feed";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:subreddit" element={<FeedWrapper />} />
        <Route path="*" element={<div>404 - Not Found</div>} />
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
