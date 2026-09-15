import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "/api";

const PAGE_SIZE = 20;

const FLOW_STATES = [
  {
    key: "deepFlow",
    label: "Deep Flow",
    color: "#f97316",
    className: "deep-flow",
    icon: "⚡",
  },
  {
    key: "focused",
    label: "Focused",
    color: "#3b82f6",
    className: "focused",
    icon: "◎",
  },
  {
    key: "neutral",
    label: "Neutral",
    color: "#64748b",
    className: "neutral",
    icon: "—",
  },
  {
    key: "distracted",
    label: "Distracted",
    color: "#ef4444",
    className: "distracted",
    icon: "!",
  },
  {
    key: "burnoutRisk",
    label: "Burnout Risk",
    color: "#a855f7",
    className: "burnout-risk",
    icon: "⚠",
  },
];

function App() {
  const [developers, setDevelopers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [contextSwitch, setContextSwitch] = useState([]);
  const [flowSummary, setFlowSummary] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [sortBy, setSortBy] = useState("score");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

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

  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-IN").format(Number(value) || 0);
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

  const formatSessionTime = (seconds) => {
    const totalSeconds = Number(seconds) || 0;

    if (totalSeconds < 60) {
      return `${Math.round(totalSeconds)} sec`;
    }

    if (totalSeconds < 3600) {
      return `${Math.round(totalSeconds / 60)} min`;
    }

    return `${(totalSeconds / 3600).toFixed(1)} hr`;
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

      case "Burnout Risk":
        return "burnout-risk";

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

      case "Burnout Risk":
        return "⚠";

      default:
        return "•";
    }
  };

  const analytics = useMemo(() => {
    const developerScores = developers.map(
      (developer) => Number(developer.flow_score) || 0
    );

    const averageFlowScore =
      developerScores.length > 0
        ? developerScores.reduce((sum, score) => sum + score, 0) /
          developerScores.length
        : 0;

    const highestScore =
      developerScores.length > 0 ? Math.max(...developerScores) : 0;

    const lowestScore =
      developerScores.length > 0 ? Math.min(...developerScores) : 0;

    const totalNotifications = contextSwitch.reduce(
      (sum, item) => sum + (Number(item.total_notifications) || 0),
      0
    );

    const totalCodingTime = flowSummary.reduce(
      (sum, item) => sum + (Number(item.total_coding_time) || 0),
      0
    );

    const totalSessions = flowSummary.reduce(
      (sum, item) => sum + (Number(item.total_sessions) || 0),
      0
    );

    const stateCounts = {
      deepFlow: Number(summary?.deep_flow) || 0,
      focused: Number(summary?.focused) || 0,
      neutral: Number(summary?.neutral) || 0,
      distracted: Number(summary?.distracted) || 0,
      burnoutRisk: Number(summary?.burnout_risk) || 0,
    };

    const totalStateCount =
      stateCounts.deepFlow +
      stateCounts.focused +
      stateCounts.neutral +
      stateCounts.distracted +
      stateCounts.burnoutRisk;

    const scoreBands = [
      {
        label: "0–39",
        min: 0,
        max: 39.99,
      },
      {
        label: "40–59",
        min: 40,
        max: 59.99,
      },
      {
        label: "60–69",
        min: 60,
        max: 69.99,
      },
      {
        label: "70–79",
        min: 70,
        max: 79.99,
      },
      {
        label: "80–100",
        min: 80,
        max: 100,
      },
    ].map((band) => ({
      ...band,
      count: developerScores.filter(
        (score) => score >= band.min && score <= band.max
      ).length,
    }));

    return {
      averageFlowScore,
      highestScore,
      lowestScore,
      totalNotifications,
      totalCodingTime,
      totalSessions,
      stateCounts,
      totalStateCount,
      scoreBands,
    };
  }, [developers, summary, contextSwitch, flowSummary]);

  const contextMap = useMemo(() => {
    return new Map(
      contextSwitch.map((item) => [
        item.developer_id,
        Number(item.total_notifications) || 0,
      ])
    );
  }, [contextSwitch]);

  const flowMap = useMemo(() => {
    return new Map(
      flowSummary.map((item) => [
        item.developer_id,
        {
          sessions: Number(item.total_sessions) || 0,
          codingTime: Number(item.total_coding_time) || 0,
          avgSession: Number(item.avg_session_time) || 0,
        },
      ])
    );
  }, [flowSummary]);

  const developerRows = useMemo(() => {
    return developers.map((developer) => {
      const flowData = flowMap.get(developer.developer_id) || {};
      const notifications =
        contextMap.get(developer.developer_id) || 0;

      return {
        ...developer,
        score: Number(developer.flow_score) || 0,
        notifications,
        sessions: Number(flowData.sessions) || 0,
        codingTime: Number(flowData.codingTime) || 0,
        avgSession: Number(flowData.avgSession) || 0,
      };
    });
  }, [developers, contextMap, flowMap]);

  const filteredDevelopers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const filtered = developerRows.filter((developer) => {
      const matchesSearch =
        !search ||
        developer.developer_id.toLowerCase().includes(search);

      const matchesState =
        stateFilter === "All" ||
        developer.flow_state === stateFilter;

      return matchesSearch && matchesState;
    });

    filtered.sort((a, b) => {
      let valueA;
      let valueB;

      switch (sortBy) {
        case "developer":
          valueA = a.developer_id;
          valueB = b.developer_id;
          break;

        case "notifications":
          valueA = a.notifications;
          valueB = b.notifications;
          break;

        case "sessions":
          valueA = a.sessions;
          valueB = b.sessions;
          break;

        case "coding":
          valueA = a.codingTime;
          valueB = b.codingTime;
          break;

        case "score":
        default:
          valueA = a.score;
          valueB = b.score;
          break;
      }

      if (typeof valueA === "string") {
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return sortDirection === "asc"
        ? valueA - valueB
        : valueB - valueA;
    });

    return filtered;
  }, [
    developerRows,
    searchTerm,
    stateFilter,
    sortBy,
    sortDirection,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDevelopers.length / PAGE_SIZE)
  );

  const visibleDevelopers = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return filteredDevelopers.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );
  }, [filteredDevelopers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, stateFilter, sortBy, sortDirection]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const topContextDevelopers = useMemo(() => {
    return [...developerRows]
      .sort((a, b) => b.notifications - a.notifications)
      .slice(0, 10);
  }, [developerRows]);

  const topCodingDevelopers = useMemo(() => {
    return [...developerRows]
      .sort((a, b) => b.codingTime - a.codingTime)
      .slice(0, 10);
  }, [developerRows]);

  const highestScoreDevelopers = useMemo(() => {
    return [...developerRows]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [developerRows]);

  const maxContextNotifications = Math.max(
    ...topContextDevelopers.map((item) => item.notifications),
    1
  );

  const maxCodingTime = Math.max(
    ...topCodingDevelopers.map((item) => item.codingTime),
    1
  );

  const maxScoreBand = Math.max(
    ...analytics.scoreBands.map((band) => band.count),
    1
  );

  const donutSegments = useMemo(() => {
    if (analytics.totalStateCount === 0) {
      return "rgba(255,255,255,0.08) 0% 100%";
    }

    let currentPercentage = 0;

    return FLOW_STATES.map((state) => {
      const count = analytics.stateCounts[state.key];
      const percentage =
        (count / analytics.totalStateCount) * 100;

      const start = currentPercentage;
      const end = currentPercentage + percentage;

      currentPercentage = end;

      return `${state.color} ${start}% ${end}%`;
    }).join(", ");
  }, [analytics]);

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

  return (
    <div className="dashboard">
      <header className="top-header">
        <div className="brand-area">
          <div className="brand-logo">CS</div>

          <div className="brand-text">
            <h1>CogniStream</h1>
            <p>Developer Flow State Analytics</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="system-status">
            <span className="status-dot"></span>

            <div>
              <span className="status-label">System Status</span>
              <strong>Operational</strong>
            </div>
          </div>

          <div className="updated-info">
            <span>Last updated</span>
            <strong>{formatUpdatedTime(lastUpdated)}</strong>
          </div>

          <button
            className="refresh-button"
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
          >
            <span
              className={
                refreshing
                  ? "refresh-icon spinning"
                  : "refresh-icon"
              }
            >
              ↻
            </span>

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <div className="error-icon">!</div>

          <div>
            <strong>Connection Error</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {summary && (
        <section className="kpi-grid">
          <div className="kpi-card total-card">
            <div className="kpi-top">
              <span className="kpi-label">Total Developers</span>

              <div className="kpi-icon blue-icon">♟</div>
            </div>

            <div className="kpi-number">
              {formatNumber(summary.total_developers)}
            </div>

            <div className="kpi-description">
              Active developer profiles
            </div>
          </div>

          <div className="kpi-card deep-card">
            <div className="kpi-top">
              <span className="kpi-label">Deep Flow</span>

              <div className="kpi-icon orange-icon">⚡</div>
            </div>

            <div className="kpi-number">
              {formatNumber(summary.deep_flow)}
            </div>

            <div className="kpi-description">
              High concentration
            </div>
          </div>

          <div className="kpi-card focused-card">
            <div className="kpi-top">
              <span className="kpi-label">Focused</span>

              <div className="kpi-icon indigo-icon">◎</div>
            </div>

            <div className="kpi-number">
              {formatNumber(summary.focused)}
            </div>

            <div className="kpi-description">
              Maintaining focus
            </div>
          </div>

          <div className="kpi-card neutral-card">
            <div className="kpi-top">
              <span className="kpi-label">Neutral</span>

              <div className="kpi-icon gray-icon">—</div>
            </div>

            <div className="kpi-number">
              {formatNumber(summary.neutral)}
            </div>

            <div className="kpi-description">
              Normal activity
            </div>
          </div>

          <div className="kpi-card distracted-card">
            <div className="kpi-top">
              <span className="kpi-label">Distracted</span>

              <div className="kpi-icon red-icon">!</div>
            </div>

            <div className="kpi-number">
              {formatNumber(summary.distracted)}
            </div>

            <div className="kpi-description">
              Attention disrupted
            </div>
          </div>

          <div className="kpi-card burnout-card">
            <div className="kpi-top">
              <span className="kpi-label">Burnout Risk</span>

              <div className="kpi-icon purple-icon">⚠</div>
            </div>

            <div className="kpi-number">
              {formatNumber(summary.burnout_risk)}
            </div>

            <div className="kpi-description">
              Requires attention
            </div>
          </div>
        </section>
      )}

      <section className="summary-strip">
        <div className="summary-item">
          <span>Average Flow Score</span>
          <strong>{analytics.averageFlowScore.toFixed(2)}</strong>
        </div>

        <div className="summary-divider"></div>

        <div className="summary-item">
          <span>Total Notifications</span>
          <strong>
            {formatNumber(analytics.totalNotifications)}
          </strong>
        </div>

        <div className="summary-divider"></div>

        <div className="summary-item">
          <span>Total Coding Time</span>
          <strong>
            {formatCodingTime(analytics.totalCodingTime)}
          </strong>
        </div>

        <div className="summary-divider"></div>

        <div className="summary-item">
          <span>Total Sessions</span>
          <strong>{formatNumber(analytics.totalSessions)}</strong>
        </div>

        <div className="summary-divider"></div>

        <div className="summary-item">
          <span>Analytics Coverage</span>
          <strong>{developers.length} Developers</strong>
        </div>
      </section>

      <section className="charts-grid">
        <div className="panel distribution-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title-row">
                <div className="panel-icon blue-panel-icon">
                  ◈
                </div>

                <h2>Flow State Distribution</h2>
              </div>

              <p>
                Current developer activity classification
              </p>
            </div>

            <span className="panel-count">
              {analytics.totalStateCount} total
            </span>
          </div>

          <div className="distribution-content">
            <div
              className="donut-chart"
              style={{
                background: `conic-gradient(${donutSegments})`,
              }}
            >
              <div className="donut-center">
                <strong>
                  {analytics.averageFlowScore.toFixed(1)}
                </strong>

                <span>Avg Score</span>
              </div>
            </div>

            <div className="distribution-legend">
              {FLOW_STATES.map((state) => {
                const count = analytics.stateCounts[state.key];

                const percentage =
                  analytics.totalStateCount > 0
                    ? (count / analytics.totalStateCount) * 100
                    : 0;

                return (
                  <div className="legend-row" key={state.key}>
                    <div className="legend-name">
                      <span
                        className="legend-dot"
                        style={{
                          backgroundColor: state.color,
                        }}
                      ></span>

                      <span>{state.label}</span>
                    </div>

                    <div className="legend-value">
                      <strong>{count}</strong>

                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="panel score-distribution-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title-row">
                <div className="panel-icon purple-panel-icon">
                  ↗
                </div>

                <h2>Flow Score Distribution</h2>
              </div>

              <p>Developer scores grouped into performance ranges</p>
            </div>

            <span className="panel-count">0–100</span>
          </div>

          <div className="score-band-chart">
            {analytics.scoreBands.map((band) => {
              const height =
                (band.count / maxScoreBand) * 100;

              return (
                <div className="score-band" key={band.label}>
                  <div className="score-band-value">
                    {band.count}
                  </div>

                  <div className="score-band-track">
                    <div
                      className="score-band-fill"
                      style={{
                        height: `${height}%`,
                      }}
                    ></div>
                  </div>

                  <span>{band.label}</span>
                </div>
              );
            })}
          </div>

          <div className="score-range-footer">
            <div>
              <span>Highest</span>
              <strong>
                {analytics.highestScore.toFixed(2)}
              </strong>
            </div>

            <div>
              <span>Average</span>
              <strong>
                {analytics.averageFlowScore.toFixed(2)}
              </strong>
            </div>

            <div>
              <span>Lowest</span>
              <strong>
                {analytics.lowestScore.toFixed(2)}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="analytics-three-grid">
        <div className="panel compact-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title-row">
                <div className="panel-icon blue-panel-icon">
                  ↔
                </div>

                <h2>Top Context Switching</h2>
              </div>

              <p>Highest notification activity</p>
            </div>

            <strong className="panel-total">
              {formatNumber(analytics.totalNotifications)}
            </strong>
          </div>

          <div className="mini-bar-list">
            {topContextDevelopers.map((developer, index) => {
              const width =
                (developer.notifications /
                  maxContextNotifications) *
                100;

              return (
                <div className="mini-bar-row" key={developer.developer_id}>
                  <span className="rank-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="mini-bar-label">
                    {developer.developer_id}
                  </span>

                  <div className="mini-bar-track">
                    <div
                      className="notification-bar-fill"
                      style={{
                        width: `${width}%`,
                      }}
                    ></div>
                  </div>

                  <strong>{developer.notifications}</strong>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel compact-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title-row">
                <div className="panel-icon purple-panel-icon">
                  ▣
                </div>

                <h2>Top Coding Activity</h2>
              </div>

              <p>Developers with highest coding time</p>
            </div>

            <strong className="panel-total">
              {formatCodingTime(analytics.totalCodingTime)}
            </strong>
          </div>

          <div className="mini-bar-list">
            {topCodingDevelopers.map((developer, index) => {
              const width =
                (developer.codingTime / maxCodingTime) * 100;

              return (
                <div className="mini-bar-row" key={developer.developer_id}>
                  <span className="rank-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="mini-bar-label">
                    {developer.developer_id}
                  </span>

                  <div className="mini-bar-track">
                    <div
                      className="coding-bar-fill"
                      style={{
                        width: `${width}%`,
                      }}
                    ></div>
                  </div>

                  <strong>
                    {formatCodingTime(developer.codingTime)}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel compact-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title-row">
                <div className="panel-icon orange-panel-icon">
                  ★
                </div>

                <h2>Top Flow Scores</h2>
              </div>

              <p>Highest scoring developers</p>
            </div>

            <span className="panel-count">Top 5</span>
          </div>

          <div className="top-score-list">
            {highestScoreDevelopers.map((developer, index) => (
              <div
                className="top-score-row"
                key={developer.developer_id}
              >
                <div className="top-score-rank">
                  #{index + 1}
                </div>

                <div className="top-score-info">
                  <strong>{developer.developer_id}</strong>

                  <span
                    className={`state-badge small ${getStateClass(
                      developer.flow_state
                    )}`}
                  >
                    {getStateIcon(developer.flow_state)}
                    {developer.flow_state}
                  </span>
                </div>

                <strong className="top-score-value">
                  {developer.score.toFixed(2)}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel developer-panel">
        <div className="panel-header developer-panel-header">
          <div>
            <div className="panel-title-row">
              <div className="panel-icon blue-panel-icon">
                👥
              </div>

              <div>
                <h2>Developer Flow Overview</h2>

                <p>
                  Detailed productivity and behavioral analytics
                </p>
              </div>
            </div>
          </div>

          <span className="developer-count">
            {filteredDevelopers.length} of {developers.length}
          </span>
        </div>

        <div className="table-controls">
          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search developer ID..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <select
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value)
            }
          >
            <option value="All">All Flow States</option>
            <option value="Deep Flow">Deep Flow</option>
            <option value="Focused">Focused</option>
            <option value="Neutral">Neutral</option>
            <option value="Distracted">Distracted</option>
            <option value="Burnout Risk">Burnout Risk</option>
          </select>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value)
            }
          >
            <option value="score">Sort: Flow Score</option>
            <option value="developer">Sort: Developer</option>
            <option value="notifications">
              Sort: Notifications
            </option>
            <option value="sessions">Sort: Sessions</option>
            <option value="coding">Sort: Coding Time</option>
          </select>

          <button
            className="sort-direction-button"
            onClick={() =>
              setSortDirection((direction) =>
                direction === "asc" ? "desc" : "asc"
              )
            }
          >
            {sortDirection === "asc" ? "↑ Ascending" : "↓ Descending"}
          </button>
        </div>

        <div className="table-wrapper">
          {visibleDevelopers.length > 0 ? (
            <table className="developer-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Developer</th>
                  <th>Flow Score</th>
                  <th>Flow State</th>
                  <th>Notifications</th>
                  <th>Sessions</th>
                  <th>Coding Time</th>
                  <th>Avg. Session</th>
                </tr>
              </thead>

              <tbody>
                {visibleDevelopers.map((developer, index) => {
                  const globalIndex =
                    (currentPage - 1) * PAGE_SIZE + index + 1;

                  return (
                    <tr key={developer.developer_id}>
                      <td>
                        <span className="row-number">
                          {String(globalIndex).padStart(3, "0")}
                        </span>
                      </td>

                      <td>
                        <div className="developer-cell">
                          <div className="developer-avatar">
                            {developer.developer_id.slice(-2)}
                          </div>

                          <div>
                            <strong>
                              {developer.developer_id}
                            </strong>

                            <span>Developer</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="table-score">
                          <div className="table-score-value">
                            {developer.score.toFixed(2)}
                          </div>

                          <div className="table-score-track">
                            <div
                              className="table-score-fill"
                              style={{
                                width: `${Math.min(
                                  developer.score,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`state-badge ${getStateClass(
                            developer.flow_state
                          )}`}
                        >
                          <span>
                            {getStateIcon(developer.flow_state)}
                          </span>

                          {developer.flow_state}
                        </span>
                      </td>

                      <td>
                        <span className="table-metric">
                          {formatNumber(developer.notifications)}
                        </span>
                      </td>

                      <td>
                        <span className="table-metric">
                          {formatNumber(developer.sessions)}
                        </span>
                      </td>

                      <td>
                        <span className="table-metric">
                          {formatCodingTime(developer.codingTime)}
                        </span>
                      </td>

                      <td>
                        <span className="table-metric">
                          {formatSessionTime(developer.avgSession)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">⌕</div>

              <strong>No developers found</strong>

              <span>
                Try changing your search or flow-state filter.
              </span>
            </div>
          )}
        </div>

        <div className="pagination">
          <div className="pagination-info">
            Showing{" "}
            <strong>
              {filteredDevelopers.length === 0
                ? 0
                : (currentPage - 1) * PAGE_SIZE + 1}
            </strong>{" "}
            to{" "}
            <strong>
              {Math.min(
                currentPage * PAGE_SIZE,
                filteredDevelopers.length
              )}
            </strong>{" "}
            of{" "}
            <strong>{filteredDevelopers.length}</strong>{" "}
            developers
          </div>

          <div className="pagination-buttons">
            <button
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              disabled={currentPage === 1}
            >
              ← Previous
            </button>

            <span>
              Page <strong>{currentPage}</strong> of{" "}
              <strong>{totalPages}</strong>
            </span>

            <button
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      </section>

      <section className="classification-panel">
        <div>
          <h3>Flow State Classification</h3>

          <p>
            Developer activity classification based on flow score
            and behavioral signals.
          </p>
        </div>

        <div className="classification-list">
          {FLOW_STATES.map((state) => (
            <div
              className="classification-item"
              key={state.key}
            >
              <span
                className="classification-dot"
                style={{
                  backgroundColor: state.color,
                }}
              ></span>

              <div>
                <strong>{state.label}</strong>

                <span>
                  {state.key === "deepFlow" &&
                    "High concentration"}

                  {state.key === "focused" &&
                    "Good concentration"}

                  {state.key === "neutral" &&
                    "Normal activity"}

                  {state.key === "distracted" &&
                    "Attention disrupted"}

                  {state.key === "burnoutRisk" &&
                    "Requires attention"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>CogniStream</strong>
          <span>Developer Flow State Analytics</span>
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