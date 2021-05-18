
import withApollo from "@/hoc/withApollo";
import PortfolioForm from "../../components/forms/NewPortfolioForm";
import withAuth from '../../hoc/withAuth'
import {useCreatePortfolio} from '../../apollo/actions'
import { useRouter } from "next/dist/client/router";
import BaseLayout from "../../layout/BaseLayout";
const PortfolioNew = () => {
const [createPortfolio,{error}]=useCreatePortfolio()
const router=useRouter()
const errorMessage = (error) => {
  return (
    (error.graphQLErrors && error.graphQLErrors[0].message) ||
    "Ooooops something went wrong..."
  );
};
const handleCreatePortfolio=async(data)=>{
  await createPortfolio({variables:data})
  router.push('/portfolios')
}
  return (
    <BaseLayout>
      <div className="bwm-form mt-5">
        <div className="row">
          <div className="col-md-5 mx-auto">
            <h1 className="page-title">Create New Portfolio</h1>

            <PortfolioForm
              onSubmit={handleCreatePortfolio}
            />
            {error && (
              <div className="alert alert-danger">{errorMessage(error)}</div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

//export default withApollo(PortfolioNew);



export default withApollo(withAuth(PortfolioNew,['admin','instructor']));
