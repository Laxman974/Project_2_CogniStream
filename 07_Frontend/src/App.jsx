import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "/api";

function App() {
  const [developers, setDevelopers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [contextSwitch, setContextSwitch] = useState([]);
  const [flowSummary, setFlowSummary] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // ---------------------------------------------------------
  // LOAD DASHBOARD DATA
  // ---------------------------------------------------------

  const loadDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [
        developersResponse,
        summaryResponse,
        contextResponse,
        flowResponse,
      ] = await Promise.all([
        axios.get(`${API_URL}/developers`),
        axios.get(`${API_URL}/summary`),
        axios.get(`${API_URL}/context-switch`),
        axios.get(`${API_URL}/flow-summary`),
      ]);

      setDevelopers(developersResponse.data || []);
      setSummary(summaryResponse.data || null);
      setContextSwitch(contextResponse.data || []);
      setFlowSummary(flowResponse.data || []);

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Dashboard loading error:", err);

      setError(
        "Unable to connect to the CogniStream API. Make sure FastAPI is running on port 8000."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // ---------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------

  const getStateClass = (state) => {
    switch (state) {
      case "Deep Flow":
        return "deep-flow";

      case "Focused":
        return "focused";

      case "Neutral":
        return "neutral";

      case "Distracted":
        return "distracted";

      default:
        return "neutral";
    }
  };

  const getStateIcon = (state) => {
    switch (state) {
      case "Deep Flow":
        return "⚡";

      case "Focused":
        return "◎";

      case "Neutral":
        return "—";

      case "Distracted":
        return "!";

      default:
        return "•";
    }
  };

  const getDeveloperData = (developerId) => {
    const context = contextSwitch.find(
      (item) => item.developer_id === developerId
    );

    const flow = flowSummary.find(
      (item) => item.developer_id === developerId
    );

    return {
      notifications: Number(context?.total_notifications ?? 0),
      sessions: Number(flow?.total_sessions ?? 0),
      codingTime: Number(flow?.total_coding_time ?? 0),
      avgSession: Number(flow?.avg_session_time ?? 0),
    };
  };

  const formatCodingTime = (seconds) => {
    const totalSeconds = Number(seconds) || 0;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-IN").format(Number(number) || 0);
  };

  const formatUpdatedTime = (date) => {
    if (!date) {
      return "--";
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ---------------------------------------------------------
  // DERIVED ANALYTICS
  // ---------------------------------------------------------

  const analytics = useMemo(() => {
    const developerScores = developers.map((developer) =>
      Number(developer.flow_score) || 0
    );

    const averageFlowScore =
      developerScores.length > 0
        ? developerScores.reduce((sum, score) => sum + score, 0) /
          developerScores.length
        : 0;

    const totalNotifications = contextSwitch.reduce(
      (sum, item) => sum + (Number(item.total_notifications) || 0),
      0
    );

    const totalCodingTime = flowSummary.reduce(
      (sum, item) => sum + (Number(item.total_coding_time) || 0),
      0
    );

    const maxNotifications = Math.max(
      ...contextSwitch.map(
        (item) => Number(item.total_notifications) || 0
      ),
      1
    );

    const maxCodingTime = Math.max(
      ...flowSummary.map(
        (item) => Number(item.total_coding_time) || 0
      ),
      1
    );

    const maxScore = Math.max(
      ...developers.map(
        (developer) => Number(developer.flow_score) || 0
      ),
      1
    );

    const stateCounts = {
      deepFlow: Number(summary?.deep_flow) || 0,
      focused: Number(summary?.focused) || 0,
      neutral: Number(summary?.neutral) || 0,
      distracted: Number(summary?.distracted) || 0,
    };

    const totalStateCount =
      stateCounts.deepFlow +
      stateCounts.focused +
      stateCounts.neutral +
      stateCounts.distracted;

    return {
      averageFlowScore,
      totalNotifications,
      totalCodingTime,
      maxNotifications,
      maxCodingTime,
      maxScore,
      stateCounts,
      totalStateCount,
    };
  }, [developers, summary, contextSwitch, flowSummary]);

  // ---------------------------------------------------------
  // LOADING SCREEN
  // ---------------------------------------------------------

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">CS</div>

        <div className="loading-spinner"></div>

        <h2>Loading CogniStream</h2>

        <p>Connecting to developer analytics...</p>
      </div>
    );
  }

  // ---------------------------------------------------------
  // DASHBOARD
  // ---------------------------------------------------------

  return (
    <div className="dashboard">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="top-header">

        <div className="brand-area">

          <div className="brand-logo">
            CS
          </div>

          <div className="brand-text">

            <h1>CogniStream</h1>

            <p>
              Developer Flow State Analytics
            </p>

          </div>

        </div>


        <div className="header-actions">

          <div className="system-status">

            <span className="status-dot"></span>

            <div>
              <span className="status-label">
                System Status
              </span>

              <strong>
                Operational
              </strong>
            </div>

          </div>


          <div className="updated-info">

            <span>
              Last updated
            </span>

            <strong>
              {formatUpdatedTime(lastUpdated)}
            </strong>

          </div>


          <button
            className="refresh-button"
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
          >
            <span className={refreshing ? "refresh-icon spinning" : "refresh-icon"}>
              ↻
            </span>

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

        </div>

      </header>


      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="error-banner">

          <div className="error-icon">
            !
          </div>

          <div>
            <strong>
              Connection Error
            </strong>

            <p>
              {error}
            </p>
          </div>

        </div>
      )}


      {/* =====================================================
          KPI CARDS
      ====================================================== */}

      {summary && (
        <section className="kpi-grid">

          {/* Total Developers */}

          <div className="kpi-card total-card">

            <div className="kpi-top">

              <span className="kpi-label">
                Total Developers
              </span>

              <div className="kpi-icon blue-icon">
                <span>♟</span>
              </div>

            </div>

            <div className="kpi-number">
              {summary.total_developers}
            </div>

            <div className="kpi-description">
              Active developer profiles
            </div>

            <div className="card-decoration"></div>

          </div>


          {/* Deep Flow */}

          <div className="kpi-card deep-card">

            <div className="kpi-top">

              <span className="kpi-label">
                Deep Flow
              </span>

              <div className="kpi-icon orange-icon">
                <span>⚡</span>
              </div>

            </div>

            <div className="kpi-number">
              {summary.deep_flow}
            </div>

            <div className="kpi-description">
              High concentration
            </div>

            <div className="card-decoration"></div>

          </div>


          {/* Focused */}

          <div className="kpi-card focused-card">

            <div className="kpi-top">

              <span className="kpi-label">
                Focused
              </span>

              <div className="kpi-icon indigo-icon">
                <span>◎</span>
              </div>

            </div>

            <div className="kpi-number">
              {summary.focused}
            </div>

            <div className="kpi-description">
              Maintaining focus
            </div>

            <div className="card-decoration"></div>

          </div>


          {/* Neutral */}

          <div className="kpi-card neutral-card">

            <div className="kpi-top">

              <span className="kpi-label">
                Neutral
              </span>

              <div className="kpi-icon gray-icon">
                <span>—</span>
              </div>

            </div>

            <div className="kpi-number">
              {summary.neutral}
            </div>

            <div className="kpi-description">
              Normal activity
            </div>

            <div className="card-decoration"></div>

          </div>


          {/* Distracted */}

          <div className="kpi-card distracted-card">

            <div className="kpi-top">

              <span className="kpi-label">
                Distracted
              </span>

              <div className="kpi-icon red-icon">
                <span>!</span>
              </div>

            </div>

            <div className="kpi-number">
              {summary.distracted}
            </div>

            <div className="kpi-description">
              Attention disrupted
            </div>

            <div className="card-decoration"></div>

          </div>

        </section>
      )}


      {/* =====================================================
          ANALYTICS SUMMARY
      ====================================================== */}

      <section className="summary-strip">

        <div className="summary-item">

          <span>
            Average Flow Score
          </span>

          <strong>
            {analytics.averageFlowScore.toFixed(2)}
          </strong>

        </div>


        <div className="summary-divider"></div>


        <div className="summary-item">

          <span>
            Total Notifications
          </span>

          <strong>
            {formatNumber(analytics.totalNotifications)}
          </strong>

        </div>


        <div className="summary-divider"></div>


        <div className="summary-item">

          <span>
            Total Coding Time
          </span>

          <strong>
            {formatCodingTime(analytics.totalCodingTime)}
          </strong>

        </div>


        <div className="summary-divider"></div>


        <div className="summary-item">

          <span>
            Analytics Coverage
          </span>

          <strong>
            {developers.length} Developers
          </strong>

        </div>

      </section>


      {/* =====================================================
          CHARTS
      ====================================================== */}

      <section className="charts-grid">

        {/* FLOW STATE DISTRIBUTION */}

        <div className="panel distribution-panel">

          <div className="panel-header">

            <div>

              <div className="panel-title-row">

                <div className="panel-icon blue-panel-icon">
                  ◈
                </div>

                <h2>
                  Flow State Distribution
                </h2>

              </div>

              <p>
                Current developer activity classification
              </p>

            </div>

            <span className="panel-count">
              {developers.length} total
            </span>

          </div>


          <div className="distribution-content">

            <div
              className="donut-chart"
              style={{
                background: `conic-gradient(
                  #2563eb 0% ${analytics.totalStateCount ? (analytics.stateCounts.focused / analytics.totalStateCount) * 100 : 0}%,
                  #f97316 ${analytics.totalStateCount ? (analytics.stateCounts.focused / analytics.totalStateCount) * 100 : 0}% ${analytics.totalStateCount ? ((analytics.stateCounts.focused + analytics.stateCounts.deepFlow) / analytics.totalStateCount) * 100 : 0}%,
                  #64748b ${analytics.totalStateCount ? ((analytics.stateCounts.focused + analytics.stateCounts.deepFlow) / analytics.totalStateCount) * 100 : 0}% ${analytics.totalStateCount ? ((analytics.stateCounts.focused + analytics.stateCounts.deepFlow + analytics.stateCounts.neutral) / analytics.totalStateCount) * 100 : 0}%,
                  #ef4444 ${analytics.totalStateCount ? ((analytics.stateCounts.focused + analytics.stateCounts.deepFlow + analytics.stateCounts.neutral) / analytics.totalStateCount) * 100 : 0}% 100%
                )`,
              }}
            >

              <div className="donut-center">

                <strong>
                  {analytics.averageFlowScore.toFixed(1)}
                </strong>

                <span>
                  Avg Score
                </span>

              </div>

            </div>


            <div className="distribution-legend">

              <div className="legend-row">

                <div className="legend-name">
                  <span className="legend-dot focused-dot"></span>
                  Focused
                </div>

                <strong>
                  {analytics.stateCounts.focused}
                </strong>

              </div>


              <div className="legend-row">

                <div className="legend-name">
                  <span className="legend-dot deep-dot"></span>
                  Deep Flow
                </div>

                <strong>
                  {analytics.stateCounts.deepFlow}
                </strong>

              </div>


              <div className="legend-row">

                <div className="legend-name">
                  <span className="legend-dot neutral-dot"></span>
                  Neutral
                </div>

                <strong>
                  {analytics.stateCounts.neutral}
                </strong>

              </div>


              <div className="legend-row">

                <div className="legend-name">
                  <span className="legend-dot distracted-dot"></span>
                  Distracted
                </div>

                <strong>
                  {analytics.stateCounts.distracted}
                </strong>

              </div>

            </div>

          </div>

        </div>


        {/* FLOW SCORE */}

        <div className="panel score-panel">

          <div className="panel-header">

            <div>

              <div className="panel-title-row">

                <div className="panel-icon purple-panel-icon">
                  ↗
                </div>

                <h2>
                  Flow Score Overview
                </h2>

              </div>

              <p>
                Developer productivity score
              </p>

            </div>

            <span className="panel-count">
              Score / 100
            </span>

          </div>


          <div className="score-chart">

            {developers.map((developer) => {

              const score =
                Number(developer.flow_score) || 0;

              const width =
                Math.min((score / 100) * 100, 100);

              return (

                <div
                  className="score-chart-row"
                  key={developer.developer_id}
                >

                  <div className="score-developer">
                    {developer.developer_id}
                  </div>

                  <div className="score-chart-track">

                    <div
                      className="score-chart-fill"
                      style={{
                        width: `${width}%`,
                      }}
                    ></div>

                  </div>

                  <strong>
                    {score.toFixed(2)}
                  </strong>

                </div>

              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          DEVELOPER TABLE
      ====================================================== */}

      <section className="panel developer-panel">

        <div className="panel-header developer-panel-header">

          <div>

            <div className="panel-title-row">

              <div className="panel-icon blue-panel-icon">
                ↗
              </div>

              <div>

                <h2>
                  Developer Flow Overview
                </h2>

                <p>
                  Current productivity and flow state of developers
                </p>

              </div>

            </div>

          </div>


          <span className="developer-count">
            {developers.length} Developers
          </span>

        </div>


        <div className="table-wrapper">

          {developers.length > 0 ? (

            <table className="developer-table">

              <thead>

                <tr>

                  <th>
                    Developer
                  </th>

                  <th>
                    Flow Score
                  </th>

                  <th>
                    Flow State
                  </th>

                  <th>
                    Notifications
                  </th>

                  <th>
                    Sessions
                  </th>

                  <th>
                    Coding Time
                  </th>

                  <th>
                    Avg. Session
                  </th>

                </tr>

              </thead>


              <tbody>

                {developers.map((developer, index) => {

                  const data = getDeveloperData(
                    developer.developer_id
                  );

                  const score =
                    Number(developer.flow_score) || 0;

                  return (

                    <tr
                      key={developer.developer_id}
                    >

                      {/* Developer */}

                      <td>

                        <div className="developer-cell">

                          <div className="developer-avatar">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div>

                            <strong>
                              {developer.developer_id}
                            </strong>

                            <span>
                              Developer
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* Score */}

                      <td>

                        <div className="table-score">

                          <div className="table-score-value">
                            {score.toFixed(2)}
                          </div>

                          <div className="table-score-track">

                            <div
                              className="table-score-fill"
                              style={{
                                width: `${Math.min(score, 100)}%`,
                              }}
                            ></div>

                          </div>

                        </div>

                      </td>


                      {/* State */}

                      <td>

                        <span
                          className={`state-badge ${getStateClass(
                            developer.flow_state
                          )}`}
                        >

                          <span>
                            {getStateIcon(
                              developer.flow_state
                            )}
                          </span>

                          {developer.flow_state}

                        </span>

                      </td>


                      {/* Notifications */}

                      <td>

                        <span className="table-metric">
                          {formatNumber(data.notifications)}
                        </span>

                      </td>


                      {/* Sessions */}

                      <td>

                        <span className="table-metric">
                          {formatNumber(data.sessions)}
                        </span>

                      </td>


                      {/* Coding Time */}

                      <td>

                        <span className="table-metric">
                          {formatCodingTime(data.codingTime)}
                        </span>

                      </td>


                      {/* Average Session */}

                      <td>

                        <span className="table-metric">
                          {Math.round(
                            data.avgSession / 60
                          )}{" "}
                          min
                        </span>

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          ) : (

            <div className="empty-state">
              No developer data available.
            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          LOWER ANALYTICS
      ====================================================== */}

      <section className="lower-grid">

        {/* CONTEXT SWITCHING */}

        <div className="panel analytics-panel">

          <div className="panel-header">

            <div>

              <div className="panel-title-row">

                <div className="panel-icon blue-panel-icon">
                  ↔
                </div>

                <div>

                  <h2>
                    Context Switching
                  </h2>

                  <p>
                    Notification activity by developer
                  </p>

                </div>

              </div>

            </div>

            <strong className="panel-total">
              {formatNumber(
                analytics.totalNotifications
              )}
            </strong>

          </div>


          <div className="bar-list">

            {contextSwitch.map((item) => {

              const value =
                Number(item.total_notifications) || 0;

              const width =
                (value / analytics.maxNotifications) * 100;

              return (

                <div
                  className="analytics-bar-row"
                  key={item.developer_id}
                >

                  <span className="bar-label">
                    {item.developer_id}
                  </span>

                  <div className="bar-track">

                    <div
                      className="notification-bar-fill"
                      style={{
                        width: `${width}%`,
                      }}
                    ></div>

                  </div>

                  <strong className="bar-value">
                    {value}
                  </strong>

                </div>

              );
            })}

          </div>

        </div>


        {/* CODING ACTIVITY */}

        <div className="panel analytics-panel">

          <div className="panel-header">

            <div>

              <div className="panel-title-row">

                <div className="panel-icon purple-panel-icon">
                  ▣
                </div>

                <div>

                  <h2>
                    Coding Activity
                  </h2>

                  <p>
                    Developer session statistics
                  </p>

                </div>

              </div>

            </div>

            <strong className="panel-total">
              {flowSummary.length}
            </strong>

          </div>


          <div className="bar-list">

            {flowSummary.map((item) => {

              const codingTime =
                Number(item.total_coding_time) || 0;

              const sessions =
                Number(item.total_sessions) || 0;

              const width =
                (codingTime / analytics.maxCodingTime) * 100;

              return (

                <div
                  className="coding-row"
                  key={item.developer_id}
                >

                  <div className="coding-info">

                    <strong>
                      {item.developer_id}
                    </strong>

                    <span>
                      {formatNumber(sessions)} sessions
                    </span>

                  </div>

                  <div className="coding-bar-area">

                    <div className="bar-track">

                      <div
                        className="coding-bar-fill"
                        style={{
                          width: `${width}%`,
                        }}
                      ></div>

                    </div>

                    <strong>
                      {formatCodingTime(codingTime)}
                    </strong>

                  </div>

                </div>

              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          CLASSIFICATION LEGEND
      ====================================================== */}

      <section className="classification-panel">

        <div>

          <h3>
            Flow State Classification
          </h3>

          <p>
            Developer activity classification based on flow score and behavioral signals
          </p>

        </div>


        <div className="classification-list">

          <div className="classification-item">

            <span className="classification-dot deep-dot"></span>

            <div>
              <strong>Deep Flow</strong>
              <span>High concentration</span>
            </div>

          </div>


          <div className="classification-item">

            <span className="classification-dot focused-dot"></span>

            <div>
              <strong>Focused</strong>
              <span>Good concentration</span>
            </div>

          </div>


          <div className="classification-item">

            <span className="classification-dot neutral-dot"></span>

            <div>
              <strong>Neutral</strong>
              <span>Normal activity</span>
            </div>

          </div>


          <div className="classification-item">

            <span className="classification-dot distracted-dot"></span>

            <div>
              <strong>Distracted</strong>
              <span>Attention disrupted</span>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="footer">

        <div>
          <strong>CogniStream</strong>
          <span>
            Developer Flow State Analytics
          </span>
        </div>

        <div>
          <span>FastAPI</span>
          <span className="footer-separator">•</span>
          <span>ClickHouse</span>
          <span className="footer-separator">•</span>
          <span>React</span>
        </div>

      </footer>

    </div>
  );
}

export default App;