// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Contract is Initializable, OwnableUpgradeable {
    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/
    error WithdrawFailed();
    error InvalidScore();
    error InsufficientFee();

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/
    event GamePlayed(address indexed player, uint256 score);
    event NewPersonalBest(address indexed player, uint256 score);
    event NewGlobalRecord(address indexed player, uint256 score);
    event LeaderboardUpdated(address indexed player, uint256 score, uint256 position);

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    uint256 public playFee;

    mapping(address => uint256) public bestScore;
    mapping(address => uint256) public gamesPlayed;

    uint256 public globalBestScore;
    address public globalBestPlayer;
    uint256 public totalGamesPlayed;

    /*//////////////////////////////////////////////////////////////
                              LEADERBOARD
    //////////////////////////////////////////////////////////////*/
    uint256 public constant TOP_SIZE = 10;

    struct LeaderboardEntry {
        address player;
        uint256 score;
    }

    LeaderboardEntry[TOP_SIZE] public leaderboard;

    /*//////////////////////////////////////////////////////////////
                              INITIALIZER
    //////////////////////////////////////////////////////////////*/
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner, uint256 initialPlayFee) public initializer {
        __Ownable_init(initialOwner);
        playFee = initialPlayFee;
    }

    /*//////////////////////////////////////////////////////////////
                            GAME LOGIC
    //////////////////////////////////////////////////////////////*/
    function submitScore(uint256 score) external payable {
        if (score == 0) revert InvalidScore();
        if (msg.value < playFee) revert InsufficientFee();

        totalGamesPlayed++;
        gamesPlayed[msg.sender]++;

        emit GamePlayed(msg.sender, score);

        if (score > bestScore[msg.sender]) {
            bestScore[msg.sender] = score;
            emit NewPersonalBest(msg.sender, score);
        }

        if (score > globalBestScore) {
            globalBestScore = score;
            globalBestPlayer = msg.sender;
            emit NewGlobalRecord(msg.sender, score);
        }

        _tryUpdateLeaderboard(msg.sender, score);
    }

    /*//////////////////////////////////////////////////////////////
                        LEADERBOARD LOGIC
    //////////////////////////////////////////////////////////////*/
    function _tryUpdateLeaderboard(address player, uint256 score) internal {
        for (uint256 i = 0; i < TOP_SIZE; i++) {
            if (score > leaderboard[i].score) {
                // shift down
                for (uint256 j = TOP_SIZE - 1; j > i; j--) {
                    leaderboard[j] = leaderboard[j - 1];
                }

                leaderboard[i] = LeaderboardEntry({ player: player, score: score });

                emit LeaderboardUpdated(player, score, i);
                break;
            }
        }
    }

    /*//////////////////////////////////////////////////////////////
                          ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function setPlayFee(uint256 newFee) external onlyOwner {
        playFee = newFee;
    }

    function withdraw() external onlyOwner {
        (bool success, ) = owner().call{ value: address(this).balance }("");
        if (!success) revert WithdrawFailed();
    }

    /*//////////////////////////////////////////////////////////////
                          VIEW HELPERS
    //////////////////////////////////////////////////////////////*/
    function getPlayerStats(address player) external view returns (uint256 _bestScore, uint256 _gamesPlayed) {
        return (bestScore[player], gamesPlayed[player]);
    }

    function getLeaderboard() external view returns (LeaderboardEntry[TOP_SIZE] memory) {
        return leaderboard;
    }
}
