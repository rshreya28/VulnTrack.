import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
export default function VerifyFix() {
 const [items,setItems]=useState([]),[error,setError]=useState("");
 useEffect(()=>{api.get("/analyst/pending-verification").then(r=>setItems(r.data)).catch(e=>setError(e.response?.data?.error||"Could not load fixes"));},[]);
 return <><Navbar/><div className="app-layout"><Sidebar/><main className="main-content"><div className="page-heading"><div><h1>Verify Fixes</h1><p>Open each developer's remediation report before deciding.</p></div></div>{error&&<div className="error-message">{error}</div>}{!items.length&&!error&&<div className="empty-card">No vulnerabilities awaiting verification.</div>}<div className="issue-grid">{items.map(v=><div className="issue-card" key={v.id}><h3>{v.title}</h3><p>{v.description}</p><p><b>Severity:</b> {v.severity} | <b>Developer:</b> {v.assignedToName||"-"}</p><Link className="primary-btn" style={{display:"inline-block",textDecoration:"none"}} to={`/analyst/review/${v.id}`}>View Remediation & Review</Link></div>)}</div></main></div></>;
}
