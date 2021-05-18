import { useRouter } from "next/router";
import BaseLayout from "../../../layout/BaseLayout";
import {useGetTopicsByCategory,useGetUser,useCreateTopic} from '../../../apollo/actions'
import withApollo from "../../../hoc/withApollo";
import { getDataFromTree } from "@apollo/react-ssr";
import slugify from "slugify";
import Replier from "../../../components/shared/Replier";
import { useState } from "react";
const useInitalData=()=>{
const { data: dataU } = useGetUser();
const router = useRouter();

const { slug } = router.query;

const { data: dataT } = useGetTopicsByCategory({
  variables: { category: slug },
});
const topicsByCategory = (dataT && dataT.topicsByCategory) || [];
const user = (dataU && dataU.user) || null;
return {topicsByCategory,user,slug,router}
}
const Topics = () => {
const [isRepliesOpen, setIsReplierOpen] = useState(false);
const {topicsByCategory,user,slug,router}=useInitalData()
const [createTopic]=useCreateTopic()
const handleCreateTopic=(topicData,done)=>{
  createTopic({variables:topicData})
  .then(()=>{
      setIsReplierOpen(false)
      done();
  })

}
console.log('safdsfdsfds',topicsByCategory)

const goToTopic=(slug)=>{
  router.push('/forum/topics/[slug]',`/forum/topics/${slug}`)
}
  return (
    <BaseLayout>
      <section className="section-title">
        <div className="px-2">
          <div className="pt-5 pb-4">
            <h1>Select a Topic</h1>

            <button
              disabled={!user}
              className="btn btn-primary"
              onClick={() => setIsReplierOpen(true)}
            >
              Create Topic
            </button>
            {!user && <i className="ml-2">Log in to create topic</i>}
          </div>
        </div>
      </section>
      <section className="fj-topic-list">
        <table className="table table-hover ">
          <thead>
            <tr>
              <th scope="col">Topic</th>
              <th scope="col">Category</th>
              <th scope="col">Author</th>
            </tr>
          </thead>
          <tbody>
            {topicsByCategory.map((topic) => (
              <tr key={topic._id} onClick={()=>goToTopic(topic.slug)}>
                <th>{topic.title}</th>
                <td className="category">{topic.forumCategory.title}</td>
                <td>{topic.user.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* REPLIER STARTS */}
        {/* <div className='reply-controls is-open'> */}
        <Replier
          isOpen={isRepliesOpen}
          onClose={() => setIsReplierOpen(false)}
          onSubmit={handleCreateTopic}
        />
        {/* REPLIER ENDS */}
      </section>
    </BaseLayout>
  );
};

export default withApollo(Topics, { getDataFromTree });
