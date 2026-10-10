import {
  useEffect,
  useState
} from "react";

import api from "../../api/api";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

function ManageUsers() {

  const [users, setUsers] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {

    try {

      const response =
        await api.get(
          "/admin/users"
        );

      setUsers(response.data);

    } catch (err) {

      setError(
        err.response?.data?.error ||
        "Unable to load users"
      );
    }
  };

  const deleteUser = async (id) => {

    if (
      !window.confirm(
        "Delete this user?"
      )
    ) {
      return;
    }

    try {

      await api.delete(
        `/admin/users/${id}`
      );

      setMessage(
        "User deleted successfully"
      );

      loadUsers();

    } catch (err) {

      setError(
        err.response?.data?.error ||
        "Unable to delete user"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="app-layout">

        <Sidebar />

        <main className="main-content">

          <div className="page-heading">
            <div>
              <h1>Manage Users</h1>
              <p>
                View registered system users.
              </p>
            </div>
          </div>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="table-card">

            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {users.map(user => (

                  <tr key={user.id}>

                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>

                    <td>
                      <span className="role-badge">
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {user.department || "-"}
                    </td>

                    <td>

                      {user.role !== "ADMIN" && (

                        <button
                          className="danger-btn"
                          onClick={() =>
                            deleteUser(user.id)
                          }
                        >
                          Delete
                        </button>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </main>

      </div>
    </>
  );
}

export default ManageUsers;