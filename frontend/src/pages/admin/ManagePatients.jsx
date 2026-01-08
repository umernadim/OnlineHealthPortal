import SideBar from "../../components/SideBar";

export default function ManagePatients() {
    return (
        <div className="admin-layout">

            {/* SIDEBAR */}
            <SideBar></SideBar>

            {/* MAIN CONTENT */}
            <main className="admin-content">
                <div className="manage-patients">
                    {/* HEADER */}
                    <div className="page-header">
                        <h1>Manage Patients</h1>
                        <button className="primary-btn">+ Add Patient</button>
                    </div>
                    <div className="header-bottom">
                        {/* BULK ACTIONS */}
                        <div className="bulk-actions">
                            <select>
                                <option>Bulk Actions</option>
                                <option>Approve Records</option>
                                <option>Suspend Accounts</option>
                                <option>Assign to Doctor</option>
                            </select>
                            <button className="primary-btn">Apply</button>
                        </div>
                        {/* SEARCH */}
                        <div className="search-bar">
                            <input type="text" placeholder="Search by name or ID..." />
                        </div>

                    </div>

                    {/* PATIENT TABLE */}
                    <div className="table-card">
                        <table>
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>ID</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td className="info">
                                        <img src="https://i.pinimg.com/736x/85/f5/88/85f588a884198be9c2a39dbf1703d4ce.jpg" alt="" />
                                        <span>John Doe</span>
                                    </td>
                                    <td>#P1023</td>
                                    <td>New York</td>
                                    <td className="status approved">Active</td>
                                    <td>
                                        <button className="action-btn">View</button>
                                        <button className="action-btn">Edit</button>
                                        <button className="danger-btn">Suspend</button>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="info">
                                        <img src="https://i.pinimg.com/736x/85/f5/88/85f588a884198be9c2a39dbf1703d4ce.jpg" alt="" />
                                        <span>Sarah Lee</span>
                                    </td>
                                    <td>#P1041</td>
                                    <td>Chicago</td>
                                    <td className="status pending">Pending</td>
                                    <td>
                                        <button className="action-btn">Approve</button>
                                        <button className="danger-btn">Reject</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
}
