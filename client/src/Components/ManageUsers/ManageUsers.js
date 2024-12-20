
import React, { useState,useEffect } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { fetchUsers,addUser,deleteUser,addStackName, fetchUserByCompanyName,clearState } from '../../redux/features/userLog/userLogSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const AddUsers = () => { 
  const industryType=[
    {
      category:"Select"
    },
    {
      category:"Sugar"
    },
    {
      category:"Cement"
    },
    {
      category:"Distillery"
    },
    {
      category:"Petrochemical"
    },
    {
      category:"Plup & Paper"
    },
    {
      category:"Fertilizer"
    },
    {
      category:"Tannery"
    },
    {
      category:"Pecticides"
    },
    {
      category:"Thermal Power Station"
    },
    {
      category:"Caustic Soda"
    },
    {
      category:"Pharmaceuticals"
    },
    {
      category:"Chemical"
    },
    {
      category:"Dye and Dye Stuff"
    },
    {
      category:"Refinery"
    },
    {
      category:"Copper Smelter"
    },
    {
      category:"Iron and Steel"
    },
    {
      category:"Zinc Smelter"
    },
    {
      category:"Aluminium"
    },
    {
      category:"STP/ETP"
    },
    {
      category:"NWMS/SWMS"
    },
    {
      category:"Noise"
    },
    {
      category:"Zinc Smelter"
    },
    {
  category:"CHLOR ALKALI"
    },   
    {category:"Shopping mall"},
    {category:"Hospital"},
    {category:"Office building"},
    {category:"Flat & apartment"},
    {category:"Amusement park"},
    {category:"Hotel"},
    {
      category:"Other"
    },
    {
      category:"Admin"
    },
  
  ]
  const industryPollutionCategory =[
    {category:"Select"},
    {category:"Green"},
    {category:"White"},
    {category:"Orange"},
    {category:"Red"}

  ]

  const dispatch = useDispatch();
  const {loading,error} = useSelector((state)=>state.userLog);

  const [formData, setFormData] = useState({
    userName: "",
    companyName: "",
    modelName: "",
    fname: "",
    email: "",
    mobileNumber: "",
    password: "",
    cpassword: "",
    subscriptionDate: "",
    userType: "",
    industryType: "",
    industryPollutionCategory: "",
    dataInteval: "", 
    district: "",
    state: "",
    address: "",
    latitude: "",
    longitude: "",
    productID: ""
  });





  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formDataToSend = { ...formData };
    try {
      await dispatch(addUser(formDataToSend)).unwrap();
      toast.success('The User is added successfully', {
        position: 'top-center'
      });
      setFormData({
        userName: "",
        companyName: "",
        modelName: "",
        fname: "",
        email: "",
        mobileNumber: "",
        password: "",
        cpassword: "",
        subscriptionDate: "",
        userType: "",
        industryType: "",
        industryPollutionCategory: "",  // Reset
        dataInteval: "",
        district: "",
        state: "",
        address: "",
        latitude: "",
        longitude: "",
        productID: ""
      });
    } catch (error) {
      console.log("Error in AddUser:", error);
      toast.error('An error occurred. Please try again.', {
        position: 'top-center'
      });
    }
  };
  
if (loading) {
  return <div>Loading...</div>;
}

if (error) {
  return <div>Error: {error.message}</div>;
}

   
    return (
      <div className="row">
            <div className="col-md-12 grid-margin">
              <div className="card">
                <div className="card-body">
                      
                      
                <form >
                      <div className="row">
                          <div className="col-12">
                            <h1>Add User</h1>
                            
                          </div>
                          

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput1">user ID</label>
                            <input 
                             type="text"
                             className="input-field" 
                             id="userName" 
                             name='userName'
                             value={formData.userName}
                             onChange={handleInputChange}
                             placeholder="Enter User Id"

                            />
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput2">Company Name</label>
                            <input 
                            type="text" 
                            className="input-field" 
                            id="companyName" 
                            name='companyName'
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Enter Company Name"
                            
                            />
                           
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput3">First Name</label>
                            <input 
                            type="text" 
                            className="input-field" 
                            id="fname"
                            name='fname'
                            value={formData.fname}
                            onChange={handleInputChange} 
                            placeholder="Enter First Name"
                           />
                           
                          </div>

                        

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput3">Email</label>
                            <input 
                            type="email" 
                            className="input-field" 
                            id="email" 
                            name='email'
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter Email"
                            />
                            
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput3">Mobile Number</label>
                            <input 
                            type="number" 
                            className="input-field" 
                            id="mobileNumber" 
                            name='mobileNumber'
                            value={formData.mobileNumber}
                            onChange={handleInputChange}
                            placeholder="Enter mobile Number"
                            />
                            
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput3">Model Name</label>
                            <input 
                            type="text" 
                            className="input-field" 
                            id="modelName" 
                            name='modelName'
                            value={formData.modelName}
                            onChange={handleInputChange}
                            placeholder="Enter Model Name"
                            />
                            
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput3">Product ID</label>
                            <input 
                            type="text" 
                            className="input-field" 
                            id="productID" 
                            name='productID'
                            value={formData.productID}
                            onChange={handleInputChange}
                            placeholder="Enter Model Name"
                            />
                            
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput3">Password</label>
                            <input 
                            type="password" 
                            className="input-field" 
                            id="password"
                            name='password'
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter Password"
                           />
                           
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput3">Confirm Password</label>
                            <input 
                            type="password" 
                            className="input-field" 
                            id="cpassword"
                            name='cpassword'
                            value={formData.cpassword}
                            onChange={handleInputChange}
                            placeholder="Enter Password"
                           />
                           
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput4">Date of Subscription</label>
                            <input 
                            type="date" 
                            className="input-field" 
                            id="subscriptionDate"
                            name='subscriptionDate'
                            value={formData.subscriptionDate}
                            onChange={handleInputChange} 
                            placeholder="Enter Subscription date" 
                           />
                            
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput5">User Type</label>
                              <select 
                              className="input-field" 
                              id='userType'
                              name='userType'
                              value={formData.userType}
                              onChange={handleInputChange}

                              >
                              
                              <option value="select">Select</option>
                              <option value="admin">Admin</option>
                              <option value="user">User</option>


                              </select>
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput5">Industry Type</label>
                              
                                <select 
                                className="input-field" 
                                id='industryType'
                                name='industryType'
                                value={formData.industryType}
                                onChange={handleInputChange}
                                >

                                {industryType.map((item)=>(
                                <option value={item.category}>{item.category}</option>
                                ))}
                              </select>
                             
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="industryPollutionCategory">Industry Pollution Category</label>
                                  <select 
                                    className="input-field" 
                                    id="industryPollutionCategory" 
                                    name="industryPollutionCategory" 
                                    value={formData.industryPollutionCategory} 
                                    onChange={handleInputChange}
                                  >
                                    {industryPollutionCategory.map((item, index) => (
                                      <option key={index} value={item.category}>
                                        {item.category}
                                      </option>
                                    ))}
                                  </select>

                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput5">Data Interval </label>
                              <select 
                              className="input-field"
                              id='dataInteval'
                              name='dataInteval'
                              value={formData.dataInteval}
                              onChange={handleInputChange} >
                               
                              <option value="select">Select</option>
                              <option value="sec">15 sec</option>
                                <option value="60">Less than 1 min</option>
                                <option value="900">Less than 15 min</option>
                                <option value="1800">Less than 30 min</option>


                              </select>
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput5">District</label>
                            <input 
                            type="text" 
                            className="input-field" 
                            id="district" 
                            name='district'
                            value={formData.district}
                            onChange={handleInputChange}
                            placeholder="Enter District"
                            />
                            
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">State</label>
                            <input 
                            type="text" 
                            className="input-field" 
                            id="state"
                            name='state'
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="Enter State" 
                            />
                           
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">Address</label>
                            <textarea 
                            type="text" 
                            className="input-field" 
                            id="address"
                            name='address'
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter Address" 
                            />
                           
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">Latitude</label>
                            <input 
                            type="text" 
                            className="input-field" 
                            id="latitude"
                            name='latitude'
                            value={formData.latitude}
                            onChange={handleInputChange} 
                            placeholder="Enter Latitude" 
                            />
                            
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">Longitude</label>
                            <input 
                            type="text" 
                            className="input-field" 
                            id="longitude" 
                            name='longitude'
                            value={formData.longitude}
                            onChange={handleInputChange}
                            placeholder="Enter longitude" 
                            />
                          
                          </div>
                          
                          
                         
                          
                          <div className="mt-4 mb-5 p-2">
                            <button 
                            type="submit" 
                            onClick={handleSubmit}      
                            className="btn btn-primary mb-2">
                               Add User 
                            </button>
                          </div>
                            <div className="mt-4 mb-5 p-2">
                            <button type="button"  className="btn btn-danger mb-2"> Cancel </button>
                            </div>
                            
                          
                      </div>
                  </form>
        <ToastContainer/>
                </div>
              </div>
            </div>
          </div>
    )
  
}


const AddStackName = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedCompany, setSelectedCompany] = useState('');
  const [stacks, setStacks] = useState([{ stackName: '', stationType: '' }]);

  const { users, selectedUser, loading, error } = useSelector((state) => state.userLog);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleInputChange = (index, field, value) => {
    const newStacks = [...stacks];
    newStacks[index][field] = value;
    setStacks(newStacks);
  };

  const handleAddInput = () => {
    setStacks([...stacks, { stackName: '', stationType: '' }]);
  };

  const handleRemoveInput = (index) => {
    const newStacks = stacks.filter((_, idx) => idx !== index);
    setStacks(newStacks);
  };

  const handleCompanyChange = async (event) => {
    const companyName = event.target.value;
    setSelectedCompany(companyName);

    if (companyName) {
      try {
        const result = await dispatch(fetchUserByCompanyName(companyName)).unwrap();
        console.log('Fetched User:', result);

        if (result.stackName && Array.isArray(result.stackName)) {
          const formattedStacks = result.stackName.map((stack) => ({
            stackName: stack.name || '',
            stationType: stack.stationType || '',
          }));
          setStacks(formattedStacks);
        } else {
          setStacks([{ stackName: '', stationType: '' }]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to fetch user data.');
        setStacks([{ stackName: '', stationType: '' }]);
      }
    }
  };

  const handleSave = async () => {
    if (!selectedCompany) {
      toast.error('Please select a company', { position: 'top-center' });
      return;
    }

    try {
      const stackData = stacks.map((stack) => ({
        name: stack.stackName,
        stationType: stack.stationType,
      }));

      console.log('Payload:', { companyName: selectedCompany, stackData });

      await dispatch(
        addStackName({
          companyName: selectedCompany,
          stackData,
        })
      ).unwrap();

      toast.success('Stack Names and Station Types added successfully', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error adding stack names:', error);
      toast.error('An error occurred. Please try again.', { position: 'top-center' });
    }
  };

  const handleCancel = () => {
    navigate('/manage-users');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message || JSON.stringify(error)}</div>;

  return (
    <div className="row">
      <div className="col-md-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h1>Add Stack Names and Station Types</h1>
              <select className="input-field" value={selectedCompany} onChange={handleCompanyChange}>
                <option value="">Select Company</option>
                {users.map((user) => (
                  <option key={user._id} value={user.companyName}>
                    {user.companyName}
                  </option>
                ))}
              </select>
            </div>

            {stacks.map((stack, index) => (
              <div key={index} className="mb-3 d-flex align-items-center">
                <input
                  type="text"
                  value={stack.stackName}
                  onChange={(e) => handleInputChange(index, 'stackName', e.target.value)}
                  className="input-field mr-2"
                  placeholder="Enter Stack Name"
                />
                <input
                  type="text"
                  value={stack.stationType}
                  onChange={(e) => handleInputChange(index, 'stationType', e.target.value)}
                  className="input-field mr-2"
                  placeholder="Enter Station Type"
                />
                {index > 0 && (
                  <button type="button" onClick={() => handleRemoveInput(index)} className="btn btn-danger">
                    -
                  </button>
                )}
              </div>
            ))}

            <button type="button" onClick={handleAddInput} className="btn btn-secondary mb-2">
              + Add Another Stack and Station Type
            </button>

            <div className="mt-4">
              <button onClick={handleSave} className="btn btn-primary mb-2">Save</button>
              <button onClick={handleCancel} className="btn btn-danger mb-2 ml-2">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const DeleteUsers = () => { 

const [userName,setUserName]=useState('');
const dispatch =useDispatch();

const handleSubmit =async(e)=>{
  e.preventDefault();

  if(!userName){
    return toast.warning('Please Enter the user ID',{
      position:'top-center'
    })
  }
  try {
   await dispatch(deleteUser(userName)).unwrap();
       toast.success('user deleted Successfully',{
      position:'top-center'
    })
    setUserName('')   
  } catch (error) { 
    console.error(`Error deleting user:`,error);
    toast.error('Error in Deleting User /  User ID not found',{
      position:'top-center'
    })
  }
}

    return (
      <div className="row">
            <div className="col-md-12 grid-margin">
              <div className="card">
                <div className="card-body">
                <form >
                    <div className="row">
                        <div className="col-12">
                          <h1>Delete User</h1>
                        </div>
                        <div className="col-12 col-lg-6 col-md-6 mb-3">
                          <label htmlFor="exampleFormControlInput7">user ID</label>
                          <input type="text" 
                          className="input-field"
                          id="exampleFormControlInput7"
                          placeholder="Enter user ID" 
                          value={userName}
                          onChange={(e)=>setUserName(e.target.value)}
                          />
                        </div>
                        <div className="col-12  mb-3">
                          <button type="submit" className="btn btn-danger mb-2"onClick={handleSubmit}>Delete User</button>
                        </div>
                      </div>
                  </form>

                </div>
              </div>
            </div>
            <ToastContainer />
          </div>
    )
}
const EditUser =()=>{
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.userLog);

  useEffect(()=>{
    dispatch(fetchUsers());
  },[dispatch]);
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return(
    <div className="row">
    <div className="col-12">
    <h1>Edit Active Users </h1>
  </div>
  <div className="col-12  mb-3">
    <ul className="list-group">
    {users.map(user => (  
    <li key={user._id} className="list-group-item">{user.companyName}
          <div className="FloatRight">
          <Link to={`/edit-user/${user._id}`}><button className="btn btn-primary m-3">Edit</button></Link>
          
          </div>
        </li>
         ))}
    </ul>
  </div>
</div>
  )
}
const ManageUsers = () => { 

    return (
      <div className="main-panel">
        <div className="content-wrapper">
          {/* <!-- Page Title Header Starts--> */}
          <div className="row page-title-header">
            <div className="col-12">
              <div className="page-header">
                <h4 className="page-title">Control and Monitor Dashboard</h4>
                <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
                 
                  <ul className="quick-links ml-auto">
                    <li>
                      <a href="#">Settings</a>
                    </li>
                    <li>
                      <a href="#">Option 1</a>
                    </li>
                    <li>
                      <a href="#">option 2</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Page Title Header Ends--> */}

          <AddUsers/>
          <AddStackName/>
          <DeleteUsers/>
          <EditUser/>

        </div>

        <footer className="footer">
          <div className="container-fluid clearfix">
            <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">
              AquaBox Control and Monitor System
            </span>
            <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
              {" "}
              ©{" "}
              <a href="" target="_blank">
                Ebhoom Solutions LLP
              </a>{" "}
              2022
            </span>
          </div>
        </footer>
      </div>
    )
}


export default ManageUsers;