import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    function fetchData() {
      axios
        .get('http://localhost:4000/api/posts')
        .then((info) => setPosts(info.data))
        .catch((error) => console.log(error));
    }
    fetchData();
  }, []);

  return (
    <div>
      {console.log(posts)}
      <div className="title">
        <h1>Lord of the Rings Posts</h1>
      </div>
      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <h3>
              {post.id}) {post.title}
            </h3>
            <p>{post.contents}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
