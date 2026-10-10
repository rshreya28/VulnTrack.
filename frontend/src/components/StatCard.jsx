function StatCard({
  title,
  value,
  subtitle
}) {

  return (
    <div className="stat-card">

      <p className="stat-title">
        {title}
      </p>

      <h2>{value}</h2>

      {subtitle && (
        <span className="stat-subtitle">
          {subtitle}
        </span>
      )}

    </div>
  );
}

export default StatCard;