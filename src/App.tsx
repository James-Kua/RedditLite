import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Feed from "./components/Feed";
import Error from "./views/Error";
import Home from "./views/Home";
import UserPost from "./components/UserPost";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/r/:subreddit" element={<FeedWrapper />} />
        <Route
          path="/r/:subreddit/comments/:id/:title"
          element={<SinglePostWrapper />}
        />
        <Route path="/search" element={<SearchWrapper />} />
        <Route path="/user/:username" element={<UserProfileWrapper />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;

import { useParams, useSearchParams } from "react-router-dom";
import SinglePost from "./components/SinglePost";
import SearchPage from "./components/SearchPage";

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

const SearchWrapper = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const sort = searchParams.get("sort") || "relevance";
  const time = searchParams.get("t") || "year";

  const encodedQuery = query ? encodeURIComponent(query) : "";

  return <SearchPage query={encodedQuery} sort={sort} time={time}/>;
};
