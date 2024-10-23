using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Helpers
{
    public class MaBGameSettings
    {
        public int Prison_FactionIndex { get; set; }
        public string Prison_Class { get; set; }
        public string BattleTeam1_Name { get; set; }
        public int BattleTeam1_FactionIndex { get; set; } 
        public string BattleTeam2_Name { get; set; }
        public int BattleTeam2_FactionIndex { get; set; } 
        public string BannedPlayers_File { get; set; }

        public float[] Prison_Position { get; set; }
        public float[] BattleTeam1_Position { get; set; }

        public float[] BattleTeam2_Position { get; set; }
        public EventEquipment[] EventEquipments { get; set; }

    }

    public class EventEquipment
    {
        public string Id { get; set; }
        public string Name { get; set; } 
        public string Class { get; set; }   
        public string Horse { get; set; } 
        public string Equipment_0 { get; set; } 
        public string Equipment_1 { get; set; } 
        public string Equipment_2 { get; set; } 
        public string Equipment_3 { get; set; } 
        public string Armor_Head { get; set; } 
        public string Armor_Body { get; set; } 
        public string Armor_Leg { get; set; } 
        public string Armor_Gloves { get; set; } 
        public string Armor_Cape { get; set; } 
    }




}
