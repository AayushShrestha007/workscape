import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { getActivityLog } from "../../../apis/Api";

const Container = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background-color: #2d69b3;
  color: white;

  th {
    padding: 10px;
    text-align: left;
  }
`;

const TableBody = styled.tbody`
  tr {
    &:nth-child(even) {
      background-color: #f2f2f2;
    }

    &:hover {
      background-color: #e6e6e6;
    }
  }

  td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
`;

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const response = await getActivityLog();
        if (response.data.success) {
          setLogs(response.data.logs);
        } else {
          toast.error(response.data.message || "Failed to fetch activity logs.");
        }
      } catch (error) {
        console.error("Error fetching activity logs:", error);
        toast.error(error.response?.data?.message || "Failed to fetch activity logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, []);

  return (
    <Container>
      <Title>Admin Dashboard - Activity Logs</Title>
      {loading ? (
        <p>Loading activity logs...</p>
      ) : logs.length > 0 ? (
        <Table>
          <TableHead>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>Endpoint</th>
              <th>Method</th>
              <th>Timestamp</th>
            </tr>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{log._id}</td>
                <td>{log.username}</td>
                <td>{log.endpoint}</td>
                <td>{log.method}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No activity logs found.</p>
      )}
    </Container>
  );
};

export default AdminDashboard;
