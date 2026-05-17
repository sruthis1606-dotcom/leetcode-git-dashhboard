from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import traceback

app = Flask(__name__)
CORS(app)

@app.route('/get_stats', methods=['POST', 'GET'])
def get_stats():
    try:
        if request.method == 'POST':
            data = request.json
            if not data:
                return jsonify({"error": "No data provided"}), 400
            
            username = data.get('username')
            email = data.get('email')
            
            if not username:
                return jsonify({"error": "Username is required"}), 400
            
            # Alternative working LeetCode API
            # Using LeetCode GraphQL API
            url = "https://leetcode.com/graphql"
            
            query = """
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    username
                    submitStats: submitStatsGlobal {
                        acSubmissionNum {
                            difficulty
                            count
                            submissions
                        }
                    }
                    profile {
                        ranking
                    }
                }
            }
            """
            
            variables = {"username": username}
            
            response = requests.post(url, json={"query": query, "variables": variables})
            
            if response.status_code != 200:
                return jsonify({"error": "Failed to fetch data from LeetCode"}), 500
            
            result = response.json()
            
            if not result.get('data') or not result['data'].get('matchedUser'):
                return jsonify({"error": f"User '{username}' not found on LeetCode"}), 404
            
            user_data = result['data']['matchedUser']
            submit_stats = user_data['submitStats']['acSubmissionNum']
            
            # Parse stats
            stats = {
                "totalSolved": 0,
                "easySolved": 0,
                "mediumSolved": 0,
                "hardSolved": 0
            }
            
            for stat in submit_stats:
                difficulty = stat.get('difficulty', '').lower()
                count = stat.get('count', 0)
                if difficulty == 'all':
                    stats['totalSolved'] = count
                elif difficulty == 'easy':
                    stats['easySolved'] = count
                elif difficulty == 'medium':
                    stats['mediumSolved'] = count
                elif difficulty == 'hard':
                    stats['hardSolved'] = count
            
            return jsonify({
                "email": email or "Not provided",
                "username": user_data.get('username', username),
                "totalSolved": stats['totalSolved'],
                "easySolved": stats['easySolved'],
                "mediumSolved": stats['mediumSolved'],
                "hardSolved": stats['hardSolved'],
                "ranking": user_data.get('profile', {}).get('ranking', "N/A")
            })
        
        return jsonify({"error": "Use POST method"}), 405
        
    except requests.RequestException as e:
        return jsonify({"error": f"Network error: {str(e)}"}), 500
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)