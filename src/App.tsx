import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Feed from "./components/Feed";
import Error from "./views/Error";
import Home from "./views/Home";
import UserPost from "./components/UserPost";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:subreddit" element={<FeedWrapper />} />
        <Route
          path="/:subreddit/comments/:id/:title"
          element={<SinglePostWrapper />}
        />
        <Route path="/user/:username" element={<UserProfileWrapper />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;

import { useParams } from "react-router-dom";
import SinglePost from "./components/SinglePost";

const FeedWrapper = () => {
  const { subreddit } = useParams();

  return <Feed subreddit={subreddit || "nus"} />;
};

const SinglePostWrapper = () => {
  const { subreddit = "", id = "", title = "" } = useParams();

  return <SinglePost subreddit={subreddit} postId={id} title={title} />;
};

const UserProfileWrapper = () => {
  const { username } = useParams();

  return <UserPost username={username ?? ""} />;
};
