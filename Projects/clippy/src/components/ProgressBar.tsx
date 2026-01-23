import React from 'react'
import PropTypes from 'prop-types'
import './ProgressBar.css'

interface ProgressBarProps {
  progress: number
  label?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label = 'Converting...'
}) => {
  return (
    <div className="progress-bar">
      <div className="progress-bar__container">
        <div
          className="progress-bar__fill"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="progress-bar__info">
        <span className="progress-bar__label">{label}</span>
        <span className="progress-bar__percentage">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  label: PropTypes.string
}

export default ProgressBar