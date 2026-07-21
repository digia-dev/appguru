export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      AcademicEvent: {
        Row: {
          color: string | null
          createdAt: string
          endDate: string | null
          eventType: string
          id: string
          startDate: string
          title: string
          updatedAt: string
        }
        Insert: {
          color?: string | null
          createdAt?: string
          endDate?: string | null
          eventType: string
          id: string
          startDate: string
          title: string
          updatedAt: string
        }
        Update: {
          color?: string | null
          createdAt?: string
          endDate?: string | null
          eventType?: string
          id?: string
          startDate?: string
          title?: string
          updatedAt?: string
        }
        Relationships: []
      }
      AcademicYear: {
        Row: {
          createdAt: string
          endDate: string
          id: string
          isActive: boolean
          label: string
          startDate: string
        }
        Insert: {
          createdAt?: string
          endDate: string
          id: string
          isActive?: boolean
          label: string
          startDate: string
        }
        Update: {
          createdAt?: string
          endDate?: string
          id?: string
          isActive?: boolean
          label?: string
          startDate?: string
        }
        Relationships: []
      }
      Attendance: {
        Row: {
          classId: string
          createdAt: string
          eventDate: string
          id: string
          notes: string | null
          session: number
          status: Database["public"]["Enums"]["AttendanceStatus"]
          studentId: string
          updatedAt: string
        }
        Insert: {
          classId: string
          createdAt?: string
          eventDate: string
          id: string
          notes?: string | null
          session?: number
          status: Database["public"]["Enums"]["AttendanceStatus"]
          studentId: string
          updatedAt: string
        }
        Update: {
          classId?: string
          createdAt?: string
          eventDate?: string
          id?: string
          notes?: string | null
          session?: number
          status?: Database["public"]["Enums"]["AttendanceStatus"]
          studentId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Attendance_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "Class"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Attendance_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "Student"
            referencedColumns: ["id"]
          },
        ]
      }
      Class: {
        Row: {
          createdAt: string
          deletedAt: string | null
          id: string
          level: number
          name: string
          section: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          deletedAt?: string | null
          id: string
          level: number
          name: string
          section: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          deletedAt?: string | null
          id?: string
          level?: number
          name?: string
          section?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Grade: {
        Row: {
          academicYearId: string | null
          classId: string
          createdAt: string
          id: string
          keterampilanRata: number | null
          pengetahuanRata: number | null
          sas: number | null
          semester: Database["public"]["Enums"]["Semester"]
          sikapDisiplin: string | null
          sikapJujur: string | null
          sikapRata: number | null
          sikapTggJawab: string | null
          sts: number | null
          studentId: string
          updatedAt: string
        }
        Insert: {
          academicYearId?: string | null
          classId: string
          createdAt?: string
          id: string
          keterampilanRata?: number | null
          pengetahuanRata?: number | null
          sas?: number | null
          semester: Database["public"]["Enums"]["Semester"]
          sikapDisiplin?: string | null
          sikapJujur?: string | null
          sikapRata?: number | null
          sikapTggJawab?: string | null
          sts?: number | null
          studentId: string
          updatedAt: string
        }
        Update: {
          academicYearId?: string | null
          classId?: string
          createdAt?: string
          id?: string
          keterampilanRata?: number | null
          pengetahuanRata?: number | null
          sas?: number | null
          semester?: Database["public"]["Enums"]["Semester"]
          sikapDisiplin?: string | null
          sikapJujur?: string | null
          sikapRata?: number | null
          sikapTggJawab?: string | null
          sts?: number | null
          studentId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Grade_academicYearId_fkey"
            columns: ["academicYearId"]
            isOneToOne: false
            referencedRelation: "AcademicYear"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Grade_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "Class"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Grade_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "Student"
            referencedColumns: ["id"]
          },
        ]
      }
      GradeBab: {
        Row: {
          bab: number
          createdAt: string
          gradeId: string
          id: string
          keterampilan1: number | null
          keterampilan2: number | null
          keterampilan3: number | null
          keterampilan4: number | null
          keterampilan5: number | null
          keterampilanRata: number | null
          pengetahuan1: number | null
          pengetahuan2: number | null
          pengetahuan3: number | null
          pengetahuan4: number | null
          pengetahuan5: number | null
          pengetahuanRata: number | null
          updatedAt: string
        }
        Insert: {
          bab: number
          createdAt?: string
          gradeId: string
          id: string
          keterampilan1?: number | null
          keterampilan2?: number | null
          keterampilan3?: number | null
          keterampilan4?: number | null
          keterampilan5?: number | null
          keterampilanRata?: number | null
          pengetahuan1?: number | null
          pengetahuan2?: number | null
          pengetahuan3?: number | null
          pengetahuan4?: number | null
          pengetahuan5?: number | null
          pengetahuanRata?: number | null
          updatedAt: string
        }
        Update: {
          bab?: number
          createdAt?: string
          gradeId?: string
          id?: string
          keterampilan1?: number | null
          keterampilan2?: number | null
          keterampilan3?: number | null
          keterampilan4?: number | null
          keterampilan5?: number | null
          keterampilanRata?: number | null
          pengetahuan1?: number | null
          pengetahuan2?: number | null
          pengetahuan3?: number | null
          pengetahuan4?: number | null
          pengetahuan5?: number | null
          pengetahuanRata?: number | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "GradeBab_gradeId_fkey"
            columns: ["gradeId"]
            isOneToOne: false
            referencedRelation: "Grade"
            referencedColumns: ["id"]
          },
        ]
      }
      LearningActivity: {
        Row: {
          classId: string
          createdAt: string
          endTime: string
          eventDate: string
          id: string
          notes: string | null
          startTime: string
          updatedAt: string
        }
        Insert: {
          classId: string
          createdAt?: string
          endTime: string
          eventDate: string
          id: string
          notes?: string | null
          startTime: string
          updatedAt: string
        }
        Update: {
          classId?: string
          createdAt?: string
          endTime?: string
          eventDate?: string
          id?: string
          notes?: string | null
          startTime?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "LearningActivity_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "Class"
            referencedColumns: ["id"]
          },
        ]
      }
      Material: {
        Row: {
          bab: number | null
          classId: string | null
          createdAt: string
          id: string
          title: string
          type: string
          updatedAt: string
          url: string
        }
        Insert: {
          bab?: number | null
          classId?: string | null
          createdAt?: string
          id: string
          title: string
          type?: string
          updatedAt: string
          url: string
        }
        Update: {
          bab?: number | null
          classId?: string | null
          createdAt?: string
          id?: string
          title?: string
          type?: string
          updatedAt?: string
          url?: string
        }
        Relationships: []
      }
      Notification: {
        Row: {
          createdAt: string
          id: string
          isRead: boolean
          message: string
          title: string
          userId: string | null
        }
        Insert: {
          createdAt?: string
          id: string
          isRead?: boolean
          message: string
          title: string
          userId?: string | null
        }
        Update: {
          createdAt?: string
          id?: string
          isRead?: boolean
          message?: string
          title?: string
          userId?: string | null
        }
        Relationships: []
      }
      Saving: {
        Row: {
          amountIn: number | null
          amountOut: number | null
          createdAt: string
          date: string
          id: string
          notes: string | null
          studentId: string
          updatedAt: string
        }
        Insert: {
          amountIn?: number | null
          amountOut?: number | null
          createdAt?: string
          date: string
          id: string
          notes?: string | null
          studentId: string
          updatedAt: string
        }
        Update: {
          amountIn?: number | null
          amountOut?: number | null
          createdAt?: string
          date?: string
          id?: string
          notes?: string | null
          studentId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Saving_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "Student"
            referencedColumns: ["id"]
          },
        ]
      }
      SavingWithdrawal: {
        Row: {
          amount: number
          createdAt: string
          date: string
          description: string | null
          id: string
          updatedAt: string
        }
        Insert: {
          amount: number
          createdAt?: string
          date: string
          description?: string | null
          id: string
          updatedAt: string
        }
        Update: {
          amount?: number
          createdAt?: string
          date?: string
          description?: string | null
          id?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Student: {
        Row: {
          address: string | null
          avatarUrl: string | null
          classId: string
          createdAt: string
          deletedAt: string | null
          dob: string | null
          fatherJob: string | null
          fatherName: string | null
          id: string
          isActive: boolean
          motherJob: string | null
          motherName: string | null
          name: string
          notes: string | null
          phone: string | null
          studentId: string
          updatedAt: string
        }
        Insert: {
          address?: string | null
          avatarUrl?: string | null
          classId: string
          createdAt?: string
          deletedAt?: string | null
          dob?: string | null
          fatherJob?: string | null
          fatherName?: string | null
          id: string
          isActive?: boolean
          motherJob?: string | null
          motherName?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          studentId: string
          updatedAt: string
        }
        Update: {
          address?: string | null
          avatarUrl?: string | null
          classId?: string
          createdAt?: string
          deletedAt?: string | null
          dob?: string | null
          fatherJob?: string | null
          fatherName?: string | null
          id?: string
          isActive?: boolean
          motherJob?: string | null
          motherName?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          studentId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Student_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "Class"
            referencedColumns: ["id"]
          },
        ]
      }
      TeacherClass: {
        Row: {
          classId: string
          createdAt: string
          id: string
          isWaliKelas: boolean
          teacherId: string
        }
        Insert: {
          classId: string
          createdAt?: string
          id: string
          isWaliKelas?: boolean
          teacherId: string
        }
        Update: {
          classId?: string
          createdAt?: string
          id?: string
          isWaliKelas?: boolean
          teacherId?: string
        }
        Relationships: [
          {
            foreignKeyName: "TeacherClass_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "Class"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TeacherClass_teacherId_fkey"
            columns: ["teacherId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          avatarUrl: string | null
          createdAt: string
          deletedAt: string | null
          email: string
          id: string
          name: string
          passwordHash: string
          phone: string | null
          role: Database["public"]["Enums"]["UserRole"]
          subject: string | null
          updatedAt: string
        }
        Insert: {
          avatarUrl?: string | null
          createdAt?: string
          deletedAt?: string | null
          email: string
          id: string
          name: string
          passwordHash: string
          phone?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          subject?: string | null
          updatedAt: string
        }
        Update: {
          avatarUrl?: string | null
          createdAt?: string
          deletedAt?: string | null
          email?: string
          id?: string
          name?: string
          passwordHash?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          subject?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      AttendanceStatus: "H" | "S" | "I" | "A"
      Semester: "GANJIL" | "GENAP"
      UserRole: "ADMIN" | "GURU" | "WALI_KELAS" | "KEPALA_SEKOLAH"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      AttendanceStatus: ["H", "S", "I", "A"],
      Semester: ["GANJIL", "GENAP"],
      UserRole: ["ADMIN", "GURU", "WALI_KELAS", "KEPALA_SEKOLAH"],
    },
  },
} as const
