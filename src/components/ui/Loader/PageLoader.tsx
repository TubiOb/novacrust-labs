import Lottie from "react-lottie-player";
import LoadingIcon from '@/assets/loader.svg'
import Spin from '../../../../public/json/spinner-white.json'

const style = { height: "70px", width: "70px" };

export default function PageLoader() {
  return (
    <div className="flex flex-col justify-between items-center">
      <img src={LoadingIcon} alt="" />
      <div className="flex items-center">
        <p className="translate-x-6">Loading</p>
        <Lottie animationData={Spin} style={style} play />
      </div>
    </div>
  );
}
