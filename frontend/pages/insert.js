import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

export default function InsertData() {
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validations
        if (!position || !salary) {
            setError('Both position and salary are required.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/insert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ position, salary }),
            });

            if (response.ok) {
                setSuccess(true);
                setPosition('');
                setSalary('');
            } else {
                setError('Failed to insert data.');
            }
        } catch (error) {
            setError('An error occurred while inserting data.');
        }
    };

    return (
        <div className="d-flex flex-column" style={{ marginTop: '60px' }}>
            <h2>Information</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Data inserted successfully!</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formPosition">
                    <Form.Label>Position/Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter the position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formSalary" style={{ marginTop: '20px' }}>
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                        type="text" // Changed to text for salary input
                        placeholder="Enter the expected salary for this position"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                    />
                </Form.Group>

                <Button style={{ marginTop: '20px' }} variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}
