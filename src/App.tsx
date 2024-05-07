import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Feed from "./components/Feed";
import Error from "./views/Error";
import Home from "./views/Home";
import SinglePost from "./components/SinglePost";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:subreddit" element={<FeedWrapper />} />
        <Route
          path="/:subreddit/comments/:id/:title"
          element={<SinglePostWrapper />}
        />
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

const SinglePostWrapper = () => {
  const { subreddit = "", id = "", title = "" } = useParams();

  return <SinglePost subreddit={subreddit} postId={id} title={title} />;
};
