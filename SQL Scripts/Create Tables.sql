Create database dragonv

GO

CREATE TABLE `players` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `PlayerId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `DiscordId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Name` varchar(512) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Hunger` int(11) NOT NULL DEFAULT 0,
  `Health` int(11) NOT NULL DEFAULT 0,
  `Money` int(11) NOT NULL DEFAULT 0,
  `Horse` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `BankAmount` int(11) NOT NULL DEFAULT 0,
  `HorseHarness` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Equipment_0` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Equipment_1` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Equipment_2` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Equipment_3` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Armor_Head` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Armor_Body` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Armor_Leg` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Armor_Gloves` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Armor_Cape` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `FactionIndex` int(11) NOT NULL DEFAULT 0,
  `Class` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'pe_peasant',
  `PosX` float NOT NULL DEFAULT 0,
  `PosY` float NOT NULL DEFAULT 0,
  `PosZ` float NOT NULL DEFAULT 0,
  `Ammo_0` int(11) NOT NULL DEFAULT 0,
  `Ammo_1` int(11) NOT NULL DEFAULT 0,
  `Ammo_2` int(11) NOT NULL DEFAULT 0,
  `Ammo_3` int(11) NOT NULL DEFAULT 0,
  `CustomName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_Players_PlayerId` (`PlayerId`),
  KEY `PlayerId__Players` (`PlayerId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
SELECT * FROM dragonv.players;

GO

CREATE TABLE `logs` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CreatedAt` datetime NOT NULL,
  `IssuerPlayerId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `IssuerPlayerName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ActionType` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `IssuerCoordinates` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `LogMessage` text NOT NULL,
  `AffectedPlayers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`AffectedPlayers`)),
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=948 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


GO

CREATE TABLE `castles` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CastleIndex` int(11) NOT NULL,
  `FactionIndex` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_Castles_CastleIndex` (`CastleIndex`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

GO 

CREATE TABLE `banrecords` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `PlayerId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `PlayerName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `BanReason` text DEFAULT NULL,
  `UnbanReason` text DEFAULT NULL,
  `BannedBy` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `CreatedAt` datetime DEFAULT NULL,
  `BanEndsAt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

GO

CREATE TABLE `discordconfig` (
  `SettingName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `SettingValue` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `SettingType` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

GO

CREATE TABLE `discordtickets` (
  `TicketID` int(11) NOT NULL AUTO_INCREMENT,
  `ChannelId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ParentId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `MessageId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `IssuerId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ClosedById` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `ClosedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`TicketID`),
  UNIQUE KEY `IX_discordtickets_ChannelId` (`ChannelId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

GO
CREATE TABLE `factions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `FactionIndex` int(11) NOT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `BannerKey` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `LordId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `PollUnlockedAt` bigint(20) NOT NULL DEFAULT 0,
  `Marshalls` text DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_Factions_FactionIndex` (`FactionIndex`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

GO

CREATE TABLE `horsemarkets` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `MissionObjectHash` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Stock` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


GO
CREATE TABLE `inventories` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `PlayerId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `InventoryId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `IsPlayerInventory` tinyint(1) NOT NULL,
  `InventorySerialized` text NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `PlayerId__Inventories` (`PlayerId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

GO

CREATE TABLE `logs` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CreatedAt` datetime NOT NULL,
  `IssuerPlayerId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `IssuerPlayerName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ActionType` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `IssuerCoordinates` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `LogMessage` text NOT NULL,
  `AffectedPlayers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`AffectedPlayers`)),
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=948 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

GO
CREATE TABLE `playernames` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `PlayerName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `PlayerId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

GO
CREATE TABLE `stockpilemarkets` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `MissionObjectHash` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `MarketItemsSerialized` text NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

GO
CREATE TABLE `upgradeablebuildings` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `MissionObjectHash` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `IsUpgrading` tinyint(1) NOT NULL DEFAULT 0,
  `CurrentTier` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

GO
CREATE TABLE `whitelist` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `PlayerId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_whitelist_PlayerId` (`PlayerId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

GO

CREATE TABLE `whitelistanswers` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `whitelistQuestionsId` int(11) NOT NULL,
  `Answer` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `DiscordId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE `whitelistquestions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Question` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


