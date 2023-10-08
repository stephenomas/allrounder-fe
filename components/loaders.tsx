
import { Oval, TailSpin } from "react-loader-spinner";

export const ButtonSpinner : React.FC = () => {
return (
  <TailSpin
    height="25"
    width="80"
    color="#ffffff"
    ariaLabel="tail-spin-loading"
    radius="1"
    wrapperStyle={{}}
    wrapperClass=""
    visible={true}
  />
);
}


export const PageLoader : React.FC = () => {
  return (
    <Oval
      height={80}
      width={80}
      color="#306cce"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="#72a1ed"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  );
}