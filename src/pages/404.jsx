import Navbar from "components/navbar/Navbar";
import Error404 from "components/error/404";
import Footer from "components/footer/Footer";

const ErrorPage = () =>{
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar/>
        <Error404/>
        <Footer/>
      </div>
    );
};

export default ErrorPage;