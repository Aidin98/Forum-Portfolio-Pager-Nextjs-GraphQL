import { useState, useRef } from "react";

import {
  useGetTopicBySlug,
  useGetPostsByTopic,
  useGetUser,
  useCreatePost,
} from "../../../apollo/actions";
import { useRouter } from "next/router";
;
import { getDataFromTree } from "@apollo/react-ssr";

;
import { toast } from "react-toastify";
import withApollo from "../../../hoc/withApollo";
import Replier from "../../../components/shared/Replier";
import PostItem from "../../../components/folder/PostItem";
import BaseLayout from "../../../layout/BaseLayout";
import AppPagination from "../../../components/shared/Pagination";


const useInitialData = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data: dataT } = useGetTopicBySlug({ variables: { slug } });
  const { data: dataP, fetchMore } = useGetPostsByTopic({
    variables: { slug },
  });
  const { data: dataU } = useGetUser();
  const topic = (dataT && dataT.topicBySlug) || {};
  const posts = (dataP && dataP.postsByTopic) || [];
  const user = (dataU && dataU.user) || null;
  return { topic, posts, user, fetchMore };
};

const PostPage = () => {
  const { topic, posts, ...rest } = useInitialData();

  return (
    <BaseLayout>
      <section className="section-title">
        <div className="px-2">
          <div className="pt-5 pb-4">
            <h1>{topic.title}</h1>
          </div>
        </div>
      </section>
      <Posts posts={posts} topic={topic} {...rest} />
    </BaseLayout>
  );
};

const Posts = ({ posts, topic, user, fetchMore }) => {
  const pageEnd = useRef();
  const [createPost, { error }] = useCreatePost();
  const [isReplierOpen, setReplierOpen] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  const handleCreatePost = async (reply, resetReplier) => {
    if (replyTo) {
      reply.parent = replyTo._id;
    }

    reply.topic = topic._id;
    await createPost({ variables: reply });
    await fetchMore({
      updateQuery: (previousResults, { fetchMoreResult }) => {
        return Object.assign({}, previousResults, {
          postsByTopic: [...fetchMoreResult.postsByTopic],
        });
      },
    });
    resetReplier();
    cleanup();
  };

  const cleanup = () => {
    setReplierOpen(false);
    toast.success("Post has been created!", { autoClose: 2000 });
    scrollToBottom();
  };

  const scrollToBottom = () =>
    pageEnd.current.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="mb-5">
      <div className="fj-post-list">
        {topic._id && <PostItem post={topic} className="topic-post-lead" />}
        {posts.map((post) => (
          <div key={post._id} className="row">
            <div className="col-md-9">
              <PostItem
                post={post}
                canCreate={user !== null}
                onReply={(reply) => {
                  setReplyTo(reply);
                  setReplierOpen(true);
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="row mt-2 mx-0">
        <div className="col-md-9">
          <div className="posts-bottom">
            {user && (
              <div className="pt-2 pb-2">
                <button
                  onClick={() => {
                    setReplyTo(null);
                    setReplierOpen(true);
                  }}
                  className="btn btn-lg btn-outline-primary"
                >
                  Create New Post
                </button>
              </div>
            )}
            <div className="pagination-container ml-auto">
              <AppPagination />
            </div>
          </div>
        </div>
      </div>
      <div ref={pageEnd}></div>
      <Replier
        isOpen={isReplierOpen}
        hasTitle={false}
        onSubmit={handleCreatePost}
        replyTo={(replyTo && replyTo.user.username) || topic.title}
        onClose={() => setReplierOpen(false)}
      />
      ;
    </section>
  );
};

export default withApollo(PostPage, { getDataFromTree });


