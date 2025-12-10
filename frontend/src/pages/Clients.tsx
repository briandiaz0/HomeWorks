import React, { useState, useEffect } from 'react';
import { clientsApi } from '../api';
import type { Client, CreateClientDto } from '../types';
import ClientForm from '../components/ClientForm';
import './Clients.css';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientsApi.getAll();
      setClients(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch clients');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (clientData: CreateClientDto) => {
    try {
      await clientsApi.create(clientData);
      await fetchClients();
      setShowForm(false);
    } catch (err) {
      console.error('Error creating client:', err);
      throw err;
    }
  };

  const handleUpdateClient = async (clientData: CreateClientDto) => {
    if (!editingClient) return;
    
    try {
      await clientsApi.update(editingClient.id, clientData);
      await fetchClients();
      setEditingClient(null);
    } catch (err) {
      console.error('Error updating client:', err);
      throw err;
    }
  };

  const handleDeleteClient = async (id: number) => {
    if (!confirm('Are you sure you want to delete this client?')) {
      return;
    }

    try {
      await clientsApi.delete(id);
      await fetchClients();
    } catch (err) {
      console.error('Error deleting client:', err);
      alert('Failed to delete client');
    }
  };

  if (loading) {
    return (
      <div className="clients">
        <div className="loading">Loading clients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="clients">
        <div className="error">{error}</div>
        <button onClick={fetchClients} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="clients">
      <div className="clients-header">
        <h1>Clients</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Client
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="form-modal-header">
              <h2>Add New Client</h2>
              <button 
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            <div className="form-modal-body">
              <ClientForm
                onSubmit={handleCreateClient}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {editingClient && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="form-modal-header">
              <h2>Edit Client</h2>
              <button 
                className="close-btn"
                onClick={() => setEditingClient(null)}
              >
                ×
              </button>
            </div>
            <div className="form-modal-body">
              <ClientForm
                initialData={editingClient}
                onSubmit={handleUpdateClient}
                onCancel={() => setEditingClient(null)}
              />
            </div>
          </div>
        </div>
      )}

      {clients.length === 0 ? (
        <div className="empty-state">
          <h3>No clients yet</h3>
          <p>Add your first client to get started with managing jobs.</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Add Your First Client
          </button>
        </div>
      ) : (
        <div className="clients-grid">
          {clients.map(client => (
            <div key={client.id} className="client-card">
              <div className="client-card-header">
                <h3>{client.name}</h3>
                <div className="client-actions">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setEditingClient(client)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="client-details">
                {client.email && (
                  <p><strong>Email:</strong> {client.email}</p>
                )}
                {client.phone && (
                  <p><strong>Phone:</strong> {client.phone}</p>
                )}
                {client.address && (
                  <p><strong>Address:</strong> {client.address}</p>
                )}
                {client.notes && (
                  <p><strong>Notes:</strong> {client.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Clients;