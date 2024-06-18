import React from 'react'

const Transaction = () => {
  return (
   
      <div className="content-wrapper">
       
        <div className="card">
          <div className="card-body">
            <div className="row mt-5">
              <div className="col-md-12">
                <h2>Payment details Of users</h2>

                <form className="form-inline my-2 my-lg-0" >
                  <input
                    className="form-control mr-sm-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    
                    
                  />
                  <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">
                    Search
                  </button>
                </form>

                <div className="table-responsive mt-3">
                  
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sl.No</th>
                          <th>User ID</th>
                          <th>Model Name</th>
                          <th>Amount </th>
                          <th>Date</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        
                            <tr >
                              <td>1</td>
                              <td>chargeMode</td>
                              <td>venus</td>
                              <td>15000</td>
                              <td>19/06/2024</td>
                              
                              
                            </tr>
                        
                        
                      </tbody>
                    </table>
                
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </div>

    

    
 
  )
}

export default Transaction
