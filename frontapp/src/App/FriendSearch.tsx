import React, { useState, useEffect, useCallback } from 'react';
import { db, auth } from '../services/firebase';
import { collection, query, where, getDocs, addDoc, Timestamp, getDoc, doc } from 'firebase/firestore';
import { Search, UserPlus, UserCheck } from 'lucide-react';
import debounce from 'lodash.debounce';
import { getProfilePicUrl } from '../utils/profilePicUtils';

interface SearchResult {
  id: string;
  email: string;
  displayName: string;
  mood: number;
  requestSent: boolean;
}

const FriendSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(
    debounce(async (term: string) => {
      if (term.length < 3 || !auth.currentUser) return;
      setIsSearching(true);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '>=', term), where('email', '<=', term + '\uf8ff'));
      try {
        const querySnapshot = await getDocs(q);
        console.log(`Search query executed. Found ${querySnapshot.size} results.`);
        const results: SearchResult[] = [];
        for (const doc of querySnapshot.docs) {
          const userData = doc.data();
          if (doc.id !== auth.currentUser.uid) {
            const requestSent = await checkFriendRequestStatus(auth.currentUser.uid, doc.id);
            results.push({
              id: doc.id,
              email: userData.email,
              displayName: userData.displayName || 'No Name',
              mood: userData.mood || 50,
              requestSent,
            });
          }
        }
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching for users:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
        }
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  const checkFriendRequestStatus = async (senderId: string, recipientId: string) => {
    const friendRequestsRef = collection(db, 'friendRequests');
    const q = query(
      friendRequestsRef,
      where('senderId', '==', senderId),
      where('recipientId', '==', recipientId),
      where('status', '==', 'pending')
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const sendFriendRequest = async (recipientId: string) => {
    if (!auth.currentUser) return;
    try {
      const friendRequestRef = collection(db, 'friendRequests');
      await addDoc(friendRequestRef, {
        senderId: auth.currentUser.uid,
        recipientId: recipientId,
        status: 'pending',
        timestamp: Timestamp.now(),
      });
      setSearchResults(prevResults =>
        prevResults.map(result =>
          result.id === recipientId ? { ...result, requestSent: true } : result
        )
      );
      alert('Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request. Please try again.');
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem',
      }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users by email"
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '0.25rem',
            border: '1px solid #4a5568',
            backgroundColor: '#2d3748',
            color: 'white',
            marginRight: '0.5rem',
          }}
        />
        <Search size={20} color="#ffffff" />
      </div>
      {isSearching && <p>Searching...</p>}
      {searchResults.length > 0 && (
        <div style={{
          backgroundColor: '#2d3748',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginTop: '1rem',
        }}>
          {searchResults.map((result) => (
            <div key={result.id} style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}>
              <img
                src={getProfilePicUrl(result.mood)}
                alt={result.displayName}
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  marginRight: '0.5rem',
                }}
              />
              <div style={{ flex: 1, color: 'white' }}>
                <div>{result.displayName}</div>
                <div style={{ fontSize: '0.8rem', color: '#a0aec0' }}>{result.email}</div>
              </div>
              {result.requestSent ? (
                <UserCheck size={20} color="#22c55e" />
              ) : (
                <button
                  onClick={() => sendFriendRequest(result.id)}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    padding: '0.25rem 0.5rem',
                    cursor: 'pointer',
                  }}
                >
                  <UserPlus size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendSearch;