//Thought is to be similar to package details with format. 
//calling userID according to session. pulling user Name and employee position
// with a input hours prompt and submit button
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "src/server/utils/api";
import { AuthContext } from "../auth/SessionProvider";
import { useContext } from "react";


const WorkLog = () => {
    const { id } = useParams(); //get sessions user id
    const { name } = useLocation(); //get sessions user name
    const { role } = useState(); //get role

    };
    // figure out authenticated to extract sessions
    const { authenticated }= useContext(AuthContext);

return (
    <div className="min-h-[80hv]">
      <div className="flex justify-center align-middle">
        <div className="container mx-40 mt-10">
          <h1 className="text-4xl font-bold text-start">Work Log</h1>
          <div>
            <div className="flex flex-row gap-4 mt-10 bg-[#3a3a38]/50 p-12 rounded-md border-2 border-[#41413E] shadow-2xl">
              <div className="grow gap-2 items-center">
                <h1 className="text-xl font-bold pb-3">Employee Name</h1>
                <p className="text-lg">{authenticated?.user?.username}</p>
              </div>
              <div className="grow gap-2 items-center">
                <h1 className="text-xl font-bold pb-3">Employee ID</h1>
                <p className="text-lg">{authenticated?.user?.id}</p>
              </div>
              <div className="grow gap-2 items-center">
                <h1 className="text-xl font-bold pb-3">Position</h1>
                <p className="text-lg">{authenticated?.user?.role}</p>
              </div>
                
              <div className="grow gap-2 items-center"> 
                <h1 className="text-xl font-bold pb-3">Add Hours</h1>
                <p className="text-lg">{workLog?.weight}</p>
              </div>

              <div className="grow gap-2 items-center">
                <h1 className="text-xl font-bold pb-3">Status</h1>
                <p className="text-lg bg-green-700  py-2 px-3 rounded-full text-white text-center w-fit">
                  fixthis
                </p>
              </div>
            </div>

            
          </div>
        </div>
      </div>
      <pre>{JSON.stringify(workLog, null, 2)}</pre>
    </div>
  );
};
  export default WorkLog;