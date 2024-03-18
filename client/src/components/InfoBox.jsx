import './info.css'

const InfoBox = ({balance}) => {
    const containerClassName = balance <= 0 ? 'info-box green-bg' : 'info-box red-bg';
    const textClassName = balance <= 0 ? 'green-text' : 'red-text';
  
  return (
    <div className={containerClassName}>
      <h2 className="balance">Ksh {balance.toFixed(2)}</h2>
    
    </div>
  )
}

export default InfoBox