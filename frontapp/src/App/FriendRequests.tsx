import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
  arrayUnion
} from 'firebase/firestore';
import { UserPlus, UserMinus, Users } from 'lucide-react';
import { CSSProperties } from 'react';
import { getProfilePicUrl } from '../utils/profilePicUtils';

interface User {
  displayName: string;
  email: string;
  mood: number;
}

interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderMood: number;
  timestamp: Date;
}

const FriendRequests: React.FC = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const friendRequestsRef = collection(db, 'friendRequests');
    const q = query(
      friendRequestsRef,
      where('recipientId', '==', auth.currentUser.uid),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const requests: FriendRequest[] = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const senderDoc = await getDoc(doc(db, 'users', data.senderId));
          const senderData = senderDoc.data() as User | undefined;

          return {
            id: docSnap.id,
            senderId: data.senderId,
            senderName: senderData?.displayName ?? 'Unknown User',
            senderEmail: senderData?.email ?? 'No Email',
            senderMood: senderData?.mood ?? 50,
            timestamp: data.timestamp.toDate(),
          };
        })
      );
      setFriendRequests(requests);
    });

    return () => unsubscribe();
  }, []);

  const handleAccept = async (requestId: string, senderId: string) => {
    try {
      await updateDoc(doc(db, 'friendRequests', requestId), { status: 'accepted' });
      const currentUserId = auth.currentUser?.uid;
      if (currentUserId) {
        await updateDoc(doc(db, 'users', currentUserId), {
          friends: arrayUnion(senderId)
        });
        await updateDoc(doc(db, 'users', senderId), {
          friends: arrayUnion(currentUserId)
        });
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await deleteDoc(doc(db, 'friendRequests', requestId));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const styles: { [key: string]: CSSProperties } = {
    container: {
      backgroundColor: '#1e1e1e',
      padding: '1rem',
      borderRadius: '0.5rem',
      width: '100%',
      boxSizing: 'border-box',
      maxHeight: '100vh',
      overflowY: 'auto',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
      padding: '0.5rem',
      borderBottom: '1px solid #4a5568',
    },
    headerIcon: {
      marginRight: '0.5rem',
      color: '#a0aec0',
    },
    headerText: {
      color: 'white',
      margin: 0,
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    requestItem: {
      backgroundColor: '#2d3748',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      marginBottom: '0.75rem',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    requestInfo: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0.5rem',
    },
    senderAvatar: {
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      objectFit: 'cover',
      marginRight: '0.75rem',
      border: '2px solid #a855f7',
    },
    senderDetails: {
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      flex: 1,
    },
    senderName: {
      fontSize: '0.9rem',
      fontWeight: '600',
      marginBottom: '0.1rem',
    },
    senderEmail: {
      fontSize: '0.8rem',
      color: '#a0aec0',
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    actionButton: {
      color: 'white',
      border: 'none',
      borderRadius: '0.25rem',
      padding: '0.4rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '2rem',
      height: '2rem',
      marginLeft: '0.5rem',
    },
    acceptButton: {
      backgroundColor: '#22c55e',
    },
    rejectButton: {
      backgroundColor: '#ef4444',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Users style={styles.headerIcon} size={24} />
        <h2 style={styles.headerText}>Friend Requests</h2>
      </div>
      {friendRequests.length === 0 ? (
        <p style={{ color: '#a0aec0' }}>No pending friend requests</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.id} style={styles.requestItem}>
            <div style={styles.requestInfo}>
              <img
                src={getProfilePicUrl(request.senderMood)}
                alt={request.senderName}
                style={styles.senderAvatar}
              />
              <div style={styles.senderDetails}>
                <p style={styles.senderName}>{request.senderName}</p>
                <p style={styles.senderEmail}>{request.senderEmail}</p>
              </div>
            </div>
            <div style={styles.actions}>
              <button
                onClick={() => handleAccept(request.id, request.senderId)}
                style={{...styles.actionButton, ...styles.acceptButton}}
              >
                <UserPlus size={16} />
              </button>
              <button
                onClick={() => handleReject(request.id)}
                style={{...styles.actionButton, ...styles.rejectButton}}
              >
                <UserMinus size={16} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendRequests;