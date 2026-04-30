// components/ReportWithCaptcha.jsx
import React, { useState, useEffect } from 'react';
import './ReportWithCaptcha.css';
import SuccessModal from './SuccessModal'; // We'll create this

const ReportWithCaptcha = () => {
    const [captcha, setCaptcha] = useState({
        id: null,
        question: null,
        userAnswer: ''
    });
    
    const [report, setReport] = useState({
        targetType: 'user',
        targetId: '',
        reason: '',
        description: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showModal, setShowModal] = useState(false); // New state for modal
    const [submittedData, setSubmittedData] = useState(null); // Store submitted data

    // Load new CAPTCHA when component mounts
    useEffect(() => {
        loadNewCaptcha();
    }, []);

    const loadNewCaptcha = async () => {
        try {
            const response = await fetch('http://localhost:3500/api/captcha/generate-captcha');
            const data = await response.json();
            
            if (data.success) {
                setCaptcha({
                    id: data.captchaId,
                    question: data.question,
                    userAnswer: ''
                });
            }
        } catch (error) {
            console.error('Error loading captcha:', error);
            setMessage({ type: 'error', text: 'Failed to load CAPTCHA' });
        }
    };

    const handleReportChange = (e) => {
        const { name, value } = e.target;
        setReport(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('http://localhost:3500/api/captcha/submit-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    captchaId: captcha.id,
                    userAnswer: captcha.userAnswer,
                    reportData: report
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            // Store submitted data for modal
            setSubmittedData({
                reportId: data.reportId,
                ...report,
                timestamp: new Date().toLocaleString()
            });
            
            // Show modal instead of alert
            setShowModal(true);
            
            // Reset form
            setReport({
                targetType: 'user',
                targetId: '',
                reason: '',
                description: ''
            });
            
            // Load new CAPTCHA
            loadNewCaptcha();
            
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
            loadNewCaptcha();
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSubmittedData(null);
    };

    return (
        <div className="captcha-container">
            <div className="captcha-card">
                <div className="card-header">
                    <h2>Report an Issue</h2>
                    <p>Help us keep our community safe and secure</p>
                </div>
                
                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.type === 'success' ? '✓' : '✗'} {message.text}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">
                            Target Type
                        </label>
                        <select
                            name="targetType"
                            value={report.targetType}
                            onChange={handleReportChange}
                            className="form-select"
                            required
                        >
                            <option value="user">👤 User Account</option>
                            <option value="post">📝 Post</option>
                            <option value="comment">💬 Comment</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">
                            Target ID
                        </label>
                        <input
                            type="number"
                            name="targetId"
                            value={report.targetId}
                            onChange={handleReportChange}
                            className="form-input"
                            placeholder="Enter the ID of the target"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">
                            Reason for Report
                        </label>
                        <select
                            name="reason"
                            value={report.reason}
                            onChange={handleReportChange}
                            className="form-select"
                            required
                        >
                            <option value="">Select a reason</option>
                            <option value="spam">🚫 Spam</option>
                            <option value="harassment">😡 Harassment</option>
                            <option value="fake_account">🎭 Fake Account</option>
                            <option value="inappropriate">🔞 Inappropriate Content</option>
                            <option value="scam">💰 Scam/Fraud</option>
                            <option value="other">❓ Other</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={report.description}
                            onChange={handleReportChange}
                            rows="4"
                            className="form-textarea"
                            placeholder="Please provide more details about this issue..."
                        ></textarea>
                    </div>
                    
                    {/* CAPTCHA Section */}
                    <div className="captcha-section">
                        <label className="form-label">
                            Verify You're Human
                        </label>
                        
                        <div className="captcha-box">
                            <div className="captcha-question">
                                <span className="question-text">{captcha.question || 'Loading...'}</span>
                            </div>
                            
                            <button
                                type="button"
                                onClick={loadNewCaptcha}
                                className="refresh-btn"
                                title="New question"
                            >
                                🔄
                            </button>
                        </div>
                        
                        <input
                            type="number"
                            value={captcha.userAnswer}
                            onChange={(e) => setCaptcha(prev => ({ ...prev, userAnswer: e.target.value }))}
                            placeholder="Enter your answer"
                            className="captcha-input"
                            required
                        />
                        <p className="captcha-hint">Enter the number only (e.g., 42)</p>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-btn"
                    >
                        {loading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            ' Submit Report'
                        )}
                    </button>
                </form>
            </div>

            {/* Success Modal */}
            {showModal && (
                <SuccessModal submittedData={submittedData} onClose={closeModal} />
            )}
        </div>
    );
};

export default ReportWithCaptcha;