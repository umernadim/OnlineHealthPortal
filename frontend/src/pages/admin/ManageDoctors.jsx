import SideBar from "../../components/SideBar";

export default function ManageDoctors() {
    return (
        <>
        <div className="manage-doctors">

            <div className="page-header">
                <h1>Manage Doctors</h1>
                <button className="primary-btn">+ Add Doctor</button>
            </div>

            <div className="filters">
                <select>
                    <option>All Specialties</option>
                    <option>Physiotherapy</option>
                    <option>Sports Rehab</option>
                    <option>Orthopedic</option>
                </select>

                <select>
                    <option>All Status</option>
                    <option>Approved</option>
                    <option>Pending</option>
                    <option>Deactivated</option>
                </select>
            </div>

            <div className="doctor-table">
                <table>
                    <thead>
                        <tr>
                            <th>Doctor</th>
                            <th>Specialty</th>
                            <th>Experience</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td className="doctor-info">
                                <img src="doctor1.jpg" alt="" />
                                <span>Dr. Olivia Wilson</span>
                            </td>
                            <td>Physiotherapy</td>
                            <td>12 Years</td>
                            <td className="status approved">Approved</td>
                            <td>
                                <button className="action-btn">View</button>
                                <button className="action-btn">Edit</button>
                                <button className="danger-btn">Deactivate</button>
                            </td>
                        </tr>

                        <tr>
                            <td className="doctor-info">
                                <img src="doctor2.jpg" alt="" />
                                <span>Dr. James Carter</span>
                            </td>
                            <td>Sports Rehab</td>
                            <td>8 Years</td>
                            <td className="status pending">Pending</td>
                            <td>
                                <button className="action-btn">Approve</button>
                                <button className="danger-btn">Reject</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ADD DOCTOR FORM */}
            <div className="form-card">
                <h2>Add New Doctor</h2>

                <div className="form-grid">
                    <input type="text" placeholder="Doctor Name" />
                    <input type="number" placeholder="Experience (Years)" />

                    <select>
                        <option>Specialty</option>
                        <option>Physiotherapy</option>
                        <option>Sports Rehab</option>
                        <option>Orthopedic</option>
                    </select>

                    <input type="text" placeholder="Availability (e.g Mon-Fri)" />
                    <input type="file" />

                </div>

                <button className="primary-btn">Save Doctor</button>
            </div>

        </div>
        </>
    );
}
