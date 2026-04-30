import React, { useEffect } from 'react';
import './SuccessModal.css';

const SuccessModal = ({ submittedData, onClose }) => {
    // Close modal when ESC key is pressed
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
        
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    // Get icon based on report reason
    const getReasonIcon = (reason) => {
        const icons = {
            spam: '🚫',
            harassment: '😡',
            fake_account: '🎭',
            inappropriate: '🔞',
            scam: '💰',
            other: '❓'
        };
        return icons[reason] || '📋';
    };

    // Get target type icon
    const getTargetIcon = (type) => {
        const icons = {
            user: '👤',
            post: '📝',
            comment: '💬'
        };
        return icons[type] || '🎯';
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="success-animation">
                        <div className="checkmark-circle">
                            <div className="checkmark-check"></div>
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                
                <div className="modal-body">
                    <h2>Report Submitted Successfully!</h2>
                    <p>Thank you for helping keep our community safe.</p>
                    
                    <div className="report-summary">
                        <h3>Report Summary</h3>
                        
                        <div className="summary-item">
                            <span className="summary-label">Report ID:</span>
                            <span className="summary-value highlight">#{submittedData?.reportId}</span>
                        </div>
                        
                        <div className="summary-item">
                            <span className="summary-label">Target:</span>
                            <span className="summary-value">
                                {getTargetIcon(submittedData?.targetType)} {submittedData?.targetType} #{submittedData?.targetId}
                            </span>
                        </div>
                        
                        <div className="summary-item">
                            <span className="summary-label">Reason:</span>
                            <span className="summary-value">
                                {getReasonIcon(submittedData?.reason)} {submittedData?.reason?.toUpperCase()}
                            </span>
                        </div>
                        
                        {submittedData?.description && (
                            <div className="summary-item description">
                                <span className="summary-label">Description:</span>
                                <span className="summary-value">{submittedData.description}</span>
                            </div>
                        )}
                        
                        <div className="summary-item">
                            <span className="summary-label">Submitted:</span>
                            <span className="summary-value">{submittedData?.timestamp}</span>
                        </div>
                    </div>
                    
                    <div className="modal-actions">
                        <button className="btn-primary" onClick={onClose}>
                            Submit Another Report
                        </button>
                        <button className="btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;