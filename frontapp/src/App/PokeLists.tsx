// PokeLists.tsx
import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { Pointer } from 'lucide-react';
import { CSSProperties } from 'react';

interface Friend {
  id: string;
  displayName: string;
  email: string;
  profilePicUrl: string;
}

const PokeLists: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const friendshipsRef = collection(db, 'friendships');

    const q1 = query(
      friendshipsRef,
      where('user1', '==', auth.currentUser.uid),
      where('status', '==', 'accepted')
    );

    const q2 = query(
      friendshipsRef,
      where('user2', '==', auth.currentUser.uid),
      where('status', '==', 'accepted')
    );

    // Temporary map to hold unique friends
    const friendsMap: { [key: string]: Friend } = {};

    // Function to fetch friend details
    const fetchFriendDetails = async (friendId: string) => {
      const friendDoc = await getDoc(doc(db, 'users', friendId));
      const friendData = friendDoc.data();
      if (friendData) {
        friendsMap[friendId] = {
          id: friendId,
          displayName: friendData.displayName || 'Unknown User',
          email: friendData.email || 'No Email',
          profilePicUrl: friendData.profilePicUrl || '',
        };
      }
    };

    // Handler for snapshot updates
    const handleSnapshot = async (snapshot: any, isUser1: boolean) => {
      const fetchPromises: Promise<void>[] = [];

      snapshot.docs.forEach((docSnap: any) => {
        const data = docSnap.data();
        const friendId = isUser1 ? data.user2 : data.user1;
        if (!friendsMap[friendId]) {
          fetchPromises.push(fetchFriendDetails(friendId));
        }
      });

      await Promise.all(fetchPromises);
      setFriends(Object.values(friendsMap));
    };

    // Subscribe to both queries
    const unsubscribe1 = onSnapshot(q1, (snapshot) => {
      handleSnapshot(snapshot, true);
    });

    const unsubscribe2 = onSnapshot(q2, (snapshot) => {
      handleSnapshot(snapshot, false);
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  const styles: { [key: string]: CSSProperties } = {
    container: {
      backgroundColor: 'rgb(216, 180, 254)',
      padding: '1rem',
      borderRadius: '1rem',
      width: '100%',
      color: 'black',
      boxSizing: 'border-box',
      overflowX: 'hidden',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    headerIcon: {
      marginRight: '0.5rem',
    },
    headerText: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
    },
    friendItem: {
      backgroundColor: '#f3e8ff',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      marginBottom: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    friendInfo: {
      display: 'flex',
      alignItems: 'center',
      flex: 1,
    },
    friendAvatar: {
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      objectFit: 'cover',
      marginRight: '1rem',
      border: '2px solid #a855f7',
    },
    friendDetails: {
      display: 'flex',
      flexDirection: 'column',
    },
    friendName: {
      fontSize: '1rem',
      fontWeight: '600',
      marginBottom: '0.25rem',
    },
    friendEmail: {
      fontSize: '0.875rem',
      color: '#6b7280',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Pointer color="#6b7280" size={24} style={styles.headerIcon} />
        <h2 style={styles.headerText}>PokeList</h2>
      </div>
      {friends.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No friends found</p>
      ) : (
        friends.map((friend) => (
          <div key={friend.id} style={styles.friendItem}>
            <div style={styles.friendInfo}>
              <img
                src={friend.profilePicUrl}
                alt={friend.displayName}
                style={styles.friendAvatar}
              />
              <div style={styles.friendDetails}>
                <p style={styles.friendName}>{friend.displayName}</p>
                <p style={styles.friendEmail}>{friend.email}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PokeLists;
