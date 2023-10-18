import { Alert } from "@roketid/windmill-react-ui";

 const MyAlert : React.FC<{element: any}>  =  ({element}) => {


  return (
    <>
      {element.error || element.data ? (
        <Alert type={element.data ? "success" : "danger"}>
          {element.data
            ? "User Created Successfully"
            : element.error &&
              (element.error as any).response.data.message}
        </Alert>
      ) : (
        ""
      )}
    
    </>
  );
   
 } 
 
 
 
 
 
 export default MyAlert